const async = require('async');
const json2csv = require('json2csv').parse
const {
  sequelize, aergov_devices, aergov_device_import_histories
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const csv = require('csvtojson');
const fs = require('fs')
const { getVersionDetails, getDevicesWithMacAddress, uppdateImportHistoryTable } = require('./inventory.query');
const { logger } = require('../../utils/logger');
const { errorResponses, status, eachLimitValue, successResponses } = require('./inventory.constant');
const { levelStarting } = require('../../utils/constant');
const { statusCodes } = require('../../utils/statusCodes');

exports.extractCsv = async ({ csvFile }) => {
  try {
    const uploadData = await this.createEntryOfImportHistory({ csvFile })
    const jsonData = await this.convertCsvToJson({ csvFilePath: csvFile.path })
    const { uniqueListOfObjects, invalidEntries } = await this.validateData({ jsonData })
    const { data: finalList } = await updateDataBase({ uniqueListOfObjects, invalidEntries })
    await this.convertJsonToCsv({ finalList })
    await this.updateImportHistory({ uploadData, status: status.COMPLETED })
    return {
      success: true,
      message: successResponses.PROCESS_COMPLETED,
    };
  }
  catch (err) {
    logger.error(err);
    await this.updateImportHistory({ uploadData, status: status.FAILED })
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
}

exports.updateImportHistory = async ({ uploadData, status }) => {
  try {
    await sequelize.query(uppdateImportHistoryTable, {
      replacements: { id: uploadData.id, status: 'COMPLETED' },
      type: sequelize.QueryTypes.SELECT,
    })
    return
  } catch (err) {
    console.log(err.message);
  }
}

exports.convertJsonToCsv = async ({ finalList }) => {
  try {
    const fields = ['mac_address', 'version_id', 'color', 'status', 'message'];
    const csv = json2csv(finalList, { fields });
    fs.writeFileSync('./output.csv', csv, 'utf-8');
    return
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
      status: 'inProgress', // capitals and form constants 
      input_file_response: 'null',
      uploaded_by: 'u_1',
    })
    return uploadData
  } catch (err) {
    console.log(err.message);
  }
}

exports.convertCsvToJson = async ({ csvFilePath }) => {
  try {
    const data = await csv().fromFile(csvFilePath);
    const updatedData = data.map((obj, index) => {
      const { 'mac address': mac_address, 'version id': version_id, ...rest } = obj;
      return { mac_address: mac_address.trim().toLowerCase(), version_id: version_id.trim().toLowerCase(), sequence: index + 1, status: status.IN_PROGRESS, message: errorResponses.IN_PROGRESS, ...rest };
    });
    fs.unlink(csvFilePath, (err) => {
      if (err) {
        logger.error('Error deleting file:', err);
      } else {
        logger.info('File deleted successfully');
      }
    });
    return updatedData
  } catch (err) {
    console.log(err);
  }
}

exports.validateData = async ({ jsonData }) => {
  try {
    let invalidEntries = []
    let { uniqueListOfObjects, duplicateListOfObjects } = await removeDuplicatedData({ jsonData })
    invalidEntries = [...duplicateListOfObjects]
    const macAddressRegex = /^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$/
    for (let entry = 0; entry < uniqueListOfObjects.length; entry++) {
      const object = uniqueListOfObjects[entry];
      if (!object.mac_address || !macAddressRegex.test(object.mac_address)) {
        object.status = status.ERROR
        object.message = errorResponses.INVALID_MAC_ADDRESS
        uniqueListOfObjects.splice(entry, 1)
        invalidEntries.push(object)
      }
      if (!object.version_id || !object.version_id.startsWith(levelStarting.version)) {
        object.status = status.ERROR
        object.message = errorResponses.INVALID_VERSION_ID
        uniqueListOfObjects.splice(entry, 1)
        invalidEntries.push(object)
      }
      if (!object.color || typeof (object.color) !== 'string') {
        object.status = status.ERROR
        object.message = errorResponses.INVALID_COLOR
        uniqueListOfObjects.splice(entry, 1)
        invalidEntries.push(object)
      }
    }
    // console.log('remaining', uniqueListOfObjects);
    // console.log('leftouts', invalidEntries);
    return { uniqueListOfObjects, invalidEntries }
  } catch (err) {
    console.log(err);
  }
}

const removeDuplicatedData = async ({ jsonData }) => {
  try {
    let duplicateMacAddress = new Set();
    let duplicateVersionId = new Set();
    let duplicateObjects = new Set();
    let uniqueListOfObjects = [];
    let duplicateListOfObjects = [];

    jsonData.forEach(object => {

      if (!duplicateMacAddress.has(object.mac_address) && !duplicateVersionId.has(object.version_id)) {
        duplicateMacAddress.add(object.mac_address);
        duplicateVersionId.add(object.version_id);
        uniqueListOfObjects.push(object);
      } else {
        if (duplicateMacAddress.has(object.mac_address)) {
          duplicateObjects.add(object.mac_address);
        }
        if (duplicateVersionId.has(object.version_id)) {
          duplicateObjects.add(object.version_id);
        }
        object.status = status.ERROR
        object.message = errorResponses.DUPLICATE_DATA
        duplicateListOfObjects.push(object);
      }
    });

    uniqueListOfObjects = uniqueListOfObjects.filter(object => {
      if (duplicateObjects.has(object.mac_address) || duplicateObjects.has(object.version_id)) {
        object.status = status.ERROR
        object.message = errorResponses.DUPLICATE_DATA
        duplicateListOfObjects.push(object)
      }
      return !duplicateObjects.has(object.mac_address) && !duplicateObjects.has(object.version_id);
    });
    return { uniqueListOfObjects, duplicateListOfObjects }
  } catch (err) {
    logger.error(err)
  }
}

const updateDataBase = async ({ uniqueListOfObjects, invalidEntries }) => {
  try {
    let finalList = [...invalidEntries]
    await eachLimitPromise(uniqueListOfObjects, eachLimitValue, async obj => {
      const { mac_address: macAddress, version_id: versionId } = obj
      // if it has the multiple errors Join them
      const { success: versionStatus, data } = await checkVersionValidity({ versionId })
      if (!versionStatus) {
        obj.status = status.ERROR
        obj.message = errorResponses.INVALID_VERSION_ID
      }
      const { success: macStatus } = await checkMacAddressValidity({ macAddress })
      if (!macStatus) {
        obj.status = status.ERROR
        obj.message = errorResponses.INVALID_MAC_ADDRESS
      }
      if (!versionStatus || !macStatus) {
        finalList.push(obj)
      }
      if (obj.status === status.IN_PROGRESS) {
        const { success: dbUploadSuccess } = await this.uploadDeviceToDb({ obj, data })
        if (dbUploadSuccess) {
          obj.status = status.SUCCESS
          obj.message = successResponses.PROCESS_COMPLETED
          finalList.push(obj)
        }
      }
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

exports.uploadDeviceToDb = async ({ obj, data }) => {
  try {
    // source Id Missing
    const uploadData = await aergov_devices.create({
      name: data.name,
      model_id: data.model_id,
      variant_id: data.variant_id,
      version_id: data.id,
      mac_number: obj.mac_address,
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