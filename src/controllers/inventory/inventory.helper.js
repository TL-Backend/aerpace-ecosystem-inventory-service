const async = require('async');
const json2csv = require('json2csv').parse
const {
  sequelize, aergov_devices, aergov_device_import_histories
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const csv = require('csvtojson');
const AWS = require('aws-sdk')
const moment = require('moment')
const fs = require('fs')
const { getVersionDetails, getDevicesWithMacAddress, updateImportHistoryTable } = require('./inventory.query');
const { logger } = require('../../utils/logger');
const { errorResponses, status, eachLimitValue, successResponses, responseFileLocation, fileExtension, momentFormat, csvFields } = require('./inventory.constant');
const { levelStarting } = require('../../utils/constant');
const { statusCodes } = require('../../utils/statusCodes');

exports.extractCsv = async ({ csvFile }) => {
  let uploadResult, inputDataUrl
  try {
    let { uploadData } = await this.createEntryOfImportHistory({ csvFile })
    uploadResult = uploadData

    if (!csvFile.originalname.endsWith(fileExtension)) {
      throw errorResponses.INVALID_CSV_FORMAT
    }

    const { publicUrl } = await uploadCsvToS3({ file: csvFile, filePath: csvFile.path, location: process.env.INPUT_FILE_LOCATION })
    inputDataUrl = publicUrl

    const { jsonData } = await this.convertCsvToJson({ csvFilePath: csvFile.path })

    const { uniqueListOfObjects, invalidEntries } = await this.validateData({ jsonData })

    const { data: finalList } = await updateDataBase({ uniqueListOfObjects, invalidEntries, sourceData: uploadData })

    const { responsePublicUrl } = await this.convertJsonToCsv({ finalList, csvFile })

    await this.updateImportHistory(
      {
        uploadData: uploadResult,
        inputPublicUrl: publicUrl,
        responsePublicUrl,
        status: status.COMPLETED
      })
    return {
      success: true,
      message: successResponses.PROCESS_COMPLETED,
    };
  }
  catch (err) {
    logger.error(err);
    await this.updateImportHistory(
      {
        uploadData: uploadResult,
        inputPublicUrl: inputDataUrl,
        status: status.FAILED
      })
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
}

exports.updateImportHistory = async ({ uploadData, inputPublicUrl, responsePublicUrl, status }) => {
  try {
    const currentInstance = moment().format()
    await sequelize.query(updateImportHistoryTable, {
      replacements: { id: uploadData ? uploadData.id : null, status, input_file: inputPublicUrl ? inputPublicUrl : null, input_file_response: responsePublicUrl ? responsePublicUrl : null, uploaded_at: currentInstance },
      type: sequelize.QueryTypes.SELECT,
    })
    return
  } catch (err) {
    logger.error(err.message);
  }
}

exports.convertJsonToCsv = async ({ finalList, csvFile }) => {
  try {
    finalList.sort((a, b) => a.sequence - b.sequence);
    const fields = csvFields
    const csv = json2csv(finalList, { fields });
    fs.writeFileSync(responseFileLocation, csv, 'utf-8');
    const { publicUrl } = await uploadCsvToS3({ file: csvFile, filePath: responseFileLocation, location: process.env.RESPONSE_FILE_LOCATION })
    fs.unlink(responseFileLocation, (err) => {
      if (err) {
        logger.error('Error deleting file:', err);
      } else {
        logger.info(' response file deleted successfully');
      }
    });
    return {
      responsePublicUrl: publicUrl
    }
  }
  catch (err) {
    logger.error(err)
  }
}

exports.createEntryOfImportHistory = async ({ csvFile }) => {
  try {
    const uploadData = await aergov_device_import_histories.create({
      file_name: csvFile.originalname,
      input_file: 'null',
      status: status.IN_PROGRESS,
      response_file: 'null', 
      uploaded_by: 'u_1',
    })
    return { uploadData }
  } catch (err) {
    logger.error(err.message);
  }
}

const uploadCsvToS3 = async ({ file, filePath, location }) => {
  try {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY_ID
    });
    const s3 = new AWS.S3();

    const fileStream = fs.createReadStream(filePath);

    const currentTime = moment().format(momentFormat)

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${location}/${currentTime}-${file.originalname}`,
      Body: fileStream
    };

    let publicUrl
    const uploadPromise = s3.upload(params).promise();
    try {
      const data = await uploadPromise;
      logger.info(successResponses.FILE_UPLOADED_SUCCESSFULLY, data.Location);
      publicUrl = `${process.env.S3_PUBLIC_URL}${location}/${currentTime}-${file.originalname}`;
      return {
        publicUrl
      }
    } catch (err) {
      logger.error(err);
    }
  } catch (err) {
    logger.error(err)
  }
}

exports.convertCsvToJson = async ({ csvFilePath }) => {
  try {
    const data = await csv().fromFile(csvFilePath);
    const updatedData = data.map((obj, index) => {
      const { 'mac address': mac_address, 'version id': version_id, ...rest } = obj;
      return {
        mac_address: mac_address.trim().toLowerCase(),
        version_id: version_id.trim().toLowerCase(),
        sequence: index + 1,
        status: status.IN_PROGRESS,
        message: errorResponses.IN_PROGRESS,
        ...rest
      };
    });
    fs.unlink(csvFilePath, (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(successResponses.FILE_DELETED_SUCCESSFULLY);
      }
    });
    return { jsonData: updatedData }
  } catch (err) {
    logger.error(err);
  }
}

exports.validateData = async ({ jsonData }) => {
  try {
    let invalidEntries = []
    let { uniqueListOfObjects, duplicateListOfObjects } = await removeDuplicatedData({ jsonData })
    invalidEntries = [...duplicateListOfObjects]
    const macAddressRegex = /^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$/
    for (let entry = uniqueListOfObjects.length - 1; entry >= 0; entry--) {
      const object = uniqueListOfObjects[entry];
      const errorList = []
      if (!object.mac_address || !macAddressRegex.test(object.mac_address)) {
        object.status = status.ERROR
        errorList.push(errorResponses.INVALID_MAC_ADDRESS)
      }
      if (!object.version_id || !object.version_id.startsWith(levelStarting.version)) {
        object.status = status.ERROR
        errorList.push(errorResponses.INVALID_VERSION_ID)
      }
      if (!object.color || typeof (object.color) !== 'string') {
        object.status = status.ERROR
        errorList.push(errorResponses.INVALID_COLOR)
      }
      if (errorList.length) {
        object.message = errorList.join(', ')
        uniqueListOfObjects.splice(entry, 1)
        invalidEntries.push(object)
      }
    }
    return { uniqueListOfObjects, invalidEntries }
  } catch (err) {
    logger.error(err);
  }
}

const removeDuplicatedData = async ({ jsonData }) => {
  try {
    const duplicateMacAddress = new Set();
    let duplicateObjects = new Set();
    let duplicateListOfObjects = [];
    let uniqueListOfObjects = [];

    jsonData.forEach(object => {
      if (!duplicateMacAddress.has(object.mac_address)) {
        duplicateMacAddress.add(object.mac_address)
        uniqueListOfObjects.push(object);
      }
      else {
        duplicateObjects.add(object.mac_address);
        object.status = status.ERROR
        object.message = errorResponses.DUPLICATE_DATA
        duplicateListOfObjects.push(object);
      }
    });

    uniqueListOfObjects = uniqueListOfObjects.filter(object => {
      if (duplicateObjects.has(object.mac_address)) {
        object.status = status.ERROR
        object.message = errorResponses.DUPLICATE_DATA
        duplicateListOfObjects.push(object)
      }
      return !duplicateObjects.has(object.mac_address);
    });
    return { uniqueListOfObjects, duplicateListOfObjects }
  } catch (err) {
    logger.error(err)
  }
}

const updateDataBase = async ({ uniqueListOfObjects, invalidEntries, sourceData }) => {
  try {
    let finalList = [...invalidEntries]

    await eachLimitPromise(uniqueListOfObjects, eachLimitValue, async obj => {
      let errorList = []
      let deviceData
      const { mac_address: macAddress, version_id: versionId } = obj

      let validVersionId = {}
      if (!validVersionId.hasOwnProperty(versionId)) {
        const { success: versionStatus, data } = await checkVersionValidity({ versionId })
        deviceData = data
        if (!versionStatus) {
          obj.status = status.ERROR
          errorList.push(errorResponses.INVALID_VERSION_ID)
          validVersionId[versionId] = false;
        }
        else {
          validVersionId[versionId] = true;
        }
      }
      else {
        if (!validVersionId[versionId]) {
          obj.status = status.ERROR
          errorList.push(errorResponses.INVALID_VERSION_ID)
        }
      }

      const { success: macStatus } = await checkMacAddressValidity({ macAddress })
      if (!macStatus) {
        obj.status = status.ERROR
        errorList.push(errorResponses.INVALID_MAC_ADDRESS)
      }

      if (errorList.length) {
        obj.message = errorList.join(', ')
      }

      if (obj.status === status.IN_PROGRESS) {
        const { success: dbUploadSuccess } = await this.uploadDeviceToDb({ obj, data: deviceData, sourceData })
        if (dbUploadSuccess) {
          obj.status = status.SUCCESS
          obj.message = successResponses.PROCESS_COMPLETED
        }
      }
      finalList.push(obj)
    })
    return {
      data: finalList
    }
  } catch (err) {
    logger.error(err)
  }
}

const eachLimitPromise = function eachLimitPromise(data, limit, operator) {
  return new Promise((resolve, reject) => {
    async.eachLimit(data, limit, (obj, callback) => {
      operator(obj).then((result) => {
        callback(null);
      }).catch(callback)
    },
      (err) => {
        if (err) return reject(err);
        return resolve();
      });
  });
};

const checkVersionValidity = async ({ versionId }) => {
  try {
    const data = await sequelize.query(getVersionDetails, {
      replacements: { version_id: versionId },
      type: sequelize.QueryTypes.SELECT,
    })
    if (!data[0]) {
      return {
        success: false,
        data: null
      }
    }
    return {
      success: true,
      data: data[0]
    }
  } catch (err) {
    logger.error(err)
  }
}

const checkMacAddressValidity = async ({ macAddress }) => {
  try {
    const data = await sequelize.query(getDevicesWithMacAddress, {
      replacements: { mac_number: macAddress },
      type: sequelize.QueryTypes.SELECT,
    })
    if (data[0].exists) {
      return {
        success: false
      }
    }
    return {
      success: true
    }
  } catch (err) {
    logger.error(err)
  }
}

exports.uploadDeviceToDb = async ({ obj, data, sourceData }) => {
  try {
    const uploadData = await aergov_devices.create({
      name: data.name,
      model_id: data.model_id,
      variant_id: data.variant_id,
      version_id: data.id,
      mac_number: obj.mac_address,
      source_file_id: sourceData.id,
      color: obj.color,
      device_type: data.device_type
    })
    if (!uploadData) {
      return {
        success: false
      }
    }
    return {
      success: true
    }
  } catch (err) {
    logger.error(err)
  }
}