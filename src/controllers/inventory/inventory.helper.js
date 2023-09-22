const { sequelize, aergov_devices,
  aergov_device_import_histories,
  aergov_device_versions, } = require("../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models")
const { logger } = require("../../utils/logger")
const { statusCodes } = require("../../utils/statusCode")
const { queries } = require("./inventory.query")
const { HelperResponse } = require('../../utils/response');
const { getImportHistoryQuery } = require('./inventory.query');
const async = require('async');
const json2csv = require('json2csv').parse;
const csv = require('csvtojson');
const AWS = require('aws-sdk');
const moment = require('moment');
const fs = require('fs');
const {
  errorResponses,
  status,
  eachLimitValue,
  successResponses,
  responseFileLocation,
  fileExtension,
  momentFormat,
  csvFields,
  activityStatus,
  keyWords,
  filterCondition, successResponses, deviceStatus, sortOrder
} = require('./inventory.constant');
const { levelStarting } = require('../../utils/constant');

exports.getInventory = async ({ params, paginationQuery }) => {
  try {
    const pageLimit = params.page_limit
    const pageNumber = params.page_number
    delete params.pageLimit
    delete params.pageNumber
    const filerOptions = []
    if (params.model_name) {
      filerOptions.push(`${filterCondition.model_name} = '${params.model_name.trim()}'`)
    }
    if (params.variant_name) {
      filerOptions.push(`${filterCondition.variant_name} = '${params.variant_name.trim()}'`)
    }
    if (params.version_name) {
      filerOptions.push(`${filterCondition.version_name} = '${params.version_name.trim()}'`)
    }
    if (params.color) {
      filerOptions.push(`${filterCondition.color} = '${params.color.trim()}'`)
    }
    if (params.status && params.status.trim() === deviceStatus.ASSIGNED) {
      filerOptions.push(`${filterCondition.distrubution_id} is NOT NULL`)
    }
    if (params.status && params.status.trim() === deviceStatus.UNASSIGNED) {
      filerOptions.push(`${filterCondition.distrubution_id} is NULL`)
    }
    let modelFilter = ''
    if (filerOptions.length > 0) {
      modelFilter = `WHERE ${filerOptions.join(" AND ")}`
    }
    const inventoryData = await sequelize.query(`${queries.getInventory} ${modelFilter} ${sortOrder} ${paginationQuery}`)
    let totalPages = Math.round(
      parseInt(inventoryData[0][0]?.data_count || 0) / parseInt(pageLimit || 10),
    );
    const data = {
      devices: inventoryData[0],
      total_count: inventoryData[0][0] ? parseInt(inventoryData[0][0].data_count) : 0,
      page_limit: parseInt(pageLimit) || 10,
      page_number: parseInt(pageNumber) || 1,
      total_pages: totalPages !== 0 ? totalPages : 1,
    }
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: data,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
}

exports.getInventoryImportHistory = async (params) => {
  try {
    const importHistory = await sequelize.query(
      getImportHistoryQuery(
        {
          pageLimit: parseInt(params.query.page_limit),
          pageNumber: parseInt(params.query.page_number),
        },
        {
          type: sequelize.QueryTypes.SELECT,
        },
      ),
    );

    let totalPages;

    totalPages = Math.round(
      parseInt(importHistory[0][0]?.total_count) /
      parseInt(importHistory[0][0]?.page_limit),
    );

    return new HelperResponse({
      success: true,
      data: {
        import_history: importHistory[0][0]?.import_histories,
        total_count: parseInt(importHistory[0][0]?.total_count) || 0,
        page_limit: importHistory[0][0]?.page_limit,
        page_number: importHistory[0][0]?.page_number,
        total_pages: totalPages,
      },
    });
  } catch (err) {
    return new HelperResponse({ success: false, message: err.message });
  }
};

exports.processCsvFile = async ({ csvFile }) => {
  let uploadResult, inputDataUrl, processStatus;
  try {
    let { uploadData } = await this.createEntryOfImportHistory({ csvFile });
    uploadResult = uploadData;

    if (!csvFile.originalname.endsWith(fileExtension)) {
      throw errorResponses.INVALID_CSV_FORMAT;
    }

    const { publicUrl } = await this.uploadCsvToS3({
      file: csvFile,
      filePath: csvFile.path,
      location: process.env.INPUT_FILE_LOCATION,
    });
    inputDataUrl = publicUrl;

    const { jsonData } = await this.convertCsvToJson({
      csvFilePath: csvFile.path,
    });

    const { validEntries, invalidEntries } = await this.validateEachEntry({
      jsonData,
    });

    const { data: finalList, invalidEntries: rejectedEntries } =
      await this.validateAndCreateDeviceEntries({
        validEntries,
        invalidEntries,
        sourceData: uploadData,
      });

    const { responsePublicUrl } = await this.convertJsonToCsvAndUploadCsv({
      finalList,
      csvFile,
    });

    if (rejectedEntries.length === jsonData.length) {
      processStatus = status.FAILED;
    } else if (rejectedEntries.length === 0) {
      processStatus = status.COMPLETED;
    } else {
      processStatus = status.PATIALLY_COMPLETED;
    }

    await this.updateImportHistory({
      uploadData: uploadResult,
      inputPublicUrl: publicUrl,
      responsePublicUrl,
      status: processStatus,
    });
    return {
      success: true,
      message: `${keyWords.process} ${processStatus}`,
      data: {
        response_file_url: responsePublicUrl,
      },
    };
  } catch (err) {
    logger.error(err);
    await this.updateImportHistory({
      uploadData: uploadResult,
      inputPublicUrl: inputDataUrl,
      status: processStatus,
    });
    if (processStatus === status.PATIALLY_COMPLETED) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_FAILURE,
        message: `${keyWords.process} ${processStatus}`,
        data: null,
      };
    }
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: `${keyWords.process} ${status.FAILED}`,
      data: null,
    };
  }
};

exports.updateImportHistory = async ({
  uploadData,
  inputPublicUrl,
  responsePublicUrl,
  status,
}) => {
  try {
    const currentInstance = moment().format();
    const data = await aergov_device_import_histories.findOne({
      where: {
        id: uploadData.id,
      },
    });
    data.status = status;
    data.input_file = inputPublicUrl;
    data.response_file = responsePublicUrl;
    data.uploaded_at = currentInstance;
    data.save();
    return;
  } catch (err) {
    logger.error(err.message);
  }
};

exports.convertJsonToCsvAndUploadCsv = async ({ finalList, csvFile }) => {
  try {
    finalList.sort((a, b) => a.sequence - b.sequence);
    const fields = csvFields;
    const csv = json2csv(finalList, { fields });
    fs.writeFileSync(responseFileLocation, csv, 'utf-8');
    const { publicUrl } = await this.uploadCsvToS3({
      file: csvFile,
      filePath: responseFileLocation,
      location: process.env.RESPONSE_FILE_LOCATION,
    });
    fs.unlink(responseFileLocation, (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(successResponses.FILE_DELETED_SUCCESSFULLY);
      }
    });
    return {
      responsePublicUrl: publicUrl,
    };
  } catch (err) {
    logger.error(err);
  }
};

exports.createEntryOfImportHistory = async ({ csvFile }) => {
  try {
    const uploadData = await aergov_device_import_histories.create({
      file_name: csvFile.originalname,
      status: status.IN_PROGRESS,
      uploaded_by: 'u_1', // TODO after implementing RBAC
    });
    return { uploadData };
  } catch (err) {
    logger.error(err.message);
  }
};

exports.uploadCsvToS3 = async ({ file, filePath, location }) => {
  try {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY_ID,
    });
    const s3 = new AWS.S3();

    const fileStream = fs.createReadStream(filePath);

    const currentTime = moment().format(momentFormat);

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${location}/${currentTime}-${file.originalname}`,
      Body: fileStream,
    };

    let publicUrl;
    const uploadPromise = s3.upload(params).promise();
    try {
      const data = await uploadPromise;
      logger.info(successResponses.FILE_UPLOADED_SUCCESSFULLY, data.Location);
      publicUrl = `${process.env.S3_PUBLIC_URL}${location}/${currentTime}-${file.originalname}`;
      return {
        publicUrl,
      };
    } catch (err) {
      logger.error(err);
    }
  } catch (err) {
    logger.error(err);
  }
};

exports.convertCsvToJson = async ({ csvFilePath }) => {
  try {
    const data = await csv().fromFile(csvFilePath);
    const updatedData = data.map((obj, index) => {
      const {
        'mac address': mac_address,
        'version id': version_id,
        ...rest
      } = obj;
      return {
        mac_address: mac_address.trim().toLowerCase(),
        version_id: version_id.trim().toLowerCase(),
        sequence: index + 1,
        status: status.IN_PROGRESS,
        message: errorResponses.IN_PROGRESS,
        ...rest,
      };
    });
    fs.unlink(csvFilePath, (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info(successResponses.FILE_DELETED_SUCCESSFULLY);
      }
    });
    return { jsonData: updatedData };
  } catch (err) {
    logger.error(err);
  }
};

exports.validateEachEntry = async ({ jsonData }) => {
  try {
    let { uniqueListOfObjects, duplicateListOfObjects } =
      await this.removeDuplicatedData({ jsonData });
    let {
      uniqueListOfObjects: validEntries,
      duplicateListOfObjects: invalidEntries,
    } = await this.validateUniqueEntries({
      uniqueListOfObjects,
      duplicateListOfObjects,
    });
    return { validEntries, invalidEntries };
  } catch (err) {
    logger.error(err);
  }
};

exports.validateUniqueEntries = async ({
  uniqueListOfObjects,
  duplicateListOfObjects,
}) => {
  try {
    const macAddressRegex = /^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$/;
    for (let entry = uniqueListOfObjects.length - 1; entry >= 0; entry--) {
      const object = uniqueListOfObjects[entry];
      const errorList = [];
      if (!object.mac_address || !macAddressRegex.test(object.mac_address)) {
        object.status = status.ERROR;
        errorList.push(errorResponses.INVALID_MAC_ADDRESS);
      }
      if (
        !object.version_id ||
        !object.version_id.startsWith(levelStarting.version)
      ) {
        object.status = status.ERROR;
        errorList.push(errorResponses.INVALID_VERSION_ID);
      }
      if (!object.color || typeof object.color !== 'string') {
        object.status = status.ERROR;
        errorList.push(errorResponses.INVALID_COLOR);
      }
      if (errorList.length) {
        object.message = errorList.join(', ');
        uniqueListOfObjects.splice(entry, 1);
        duplicateListOfObjects.push(object);
      }
    }
    return { uniqueListOfObjects, duplicateListOfObjects };
  } catch (err) {
    logger.error(err);
  }
};

exports.removeDuplicatedData = async ({ jsonData }) => {
  try {
    const duplicateMacAddress = new Set();
    let duplicateObjects = new Set();
    let duplicateListOfObjects = [];
    let uniqueListOfObjects = [];

    jsonData.forEach((object) => {
      if (!duplicateMacAddress.has(object.mac_address)) {
        duplicateMacAddress.add(object.mac_address);
        uniqueListOfObjects.push(object);
      } else {
        duplicateObjects.add(object.mac_address);
        object.status = status.ERROR;
        object.message = errorResponses.DUPLICATE_DATA;
        duplicateListOfObjects.push(object);
      }
    });

    uniqueListOfObjects = uniqueListOfObjects.filter((object) => {
      if (duplicateObjects.has(object.mac_address)) {
        object.status = status.ERROR;
        object.message = errorResponses.DUPLICATE_DATA;
        duplicateListOfObjects.push(object);
      }
      return !duplicateObjects.has(object.mac_address);
    });
    return { uniqueListOfObjects, duplicateListOfObjects };
  } catch (err) {
    logger.error(err);
  }
};

exports.validateAndCreateDeviceEntries = async ({
  validEntries,
  invalidEntries,
  sourceData,
}) => {
  try {
    let finalList = [...invalidEntries];
    let validVersionId = {};
    await this.eachLimitPromise(validEntries, eachLimitValue, async (obj) => {
      try {
        let errorList = [];
        const { mac_address: macAddress, version_id: versionId } = obj;

        if (!validVersionId.hasOwnProperty(versionId)) {
          const { success: versionStatus, data } =
            await this.checkVersionValidity({ versionId });
          if (!versionStatus) {
            obj.status = status.ERROR;
            errorList.push(errorResponses.INVALID_VERSION_ID);
            validVersionId[versionId] = {
              status: false,
              data: null,
            };
          } else {
            validVersionId[versionId] = {
              status: true,
              data: data,
            };
          }
        } else {
          if (!validVersionId[versionId].status) {
            obj.status = status.ERROR;
            errorList.push(errorResponses.INVALID_VERSION_ID);
          }
        }

        const { success: macStatus } = await this.checkMacAddressValidity({
          macAddress,
        });
        if (!macStatus) {
          obj.status = status.ERROR;
          errorList.push(errorResponses.INVALID_MAC_ADDRESS);
        }

        if (errorList.length) {
          obj.message = errorList.join(', ');
          invalidEntries.push(obj);
        }

        if (obj.status === status.IN_PROGRESS) {
          const { success: dbUploadSuccess } = await this.createDeviceEntry({
            obj,
            data: validVersionId[versionId].data,
            sourceData,
          });
          if (dbUploadSuccess) {
            obj.status = status.SUCCESS;
            obj.message = successResponses.PROCESS_COMPLETED;
          }
        }
      } catch (err) {
        logger.error(err);
        obj.status = status.ERROR
        obj.message = errorResponses.ERROR_OCCURED_AT_VALIDATION_AND_CREATION
        invalidEntries.push(obj)
      }
      finalList.push(obj);
    });
    return {
      data: finalList,
      invalidEntries,
    };
  } catch (err) {
    logger.error(err);
  }
};

exports.eachLimitPromise = function eachLimitPromise(data, limit, operator) {
  return new Promise((resolve, reject) => {
    async.eachLimit(
      data,
      limit,
      (obj, callback) => {
        operator(obj)
          .then((result) => {
            callback(null);
          })
          .catch(callback);
      },
      (err) => {
        if (err) return reject(err);
        return resolve();
      },
    );
  });
};

exports.checkVersionValidity = async ({ versionId }) => {
  try {
    const data = await aergov_device_versions.findOne({
      where: {
        id: versionId,
        status: `${activityStatus.ACTIVE}`,
      },
    });
    if (!data) {
      return {
        success: false,
        data: null,
      };
    }
    return {
      success: true,
      data: data.dataValues,
    };
  } catch (err) {
    logger.error(err);
  }
};

exports.checkMacAddressValidity = async ({ macAddress }) => {
  try {
    const data = await aergov_devices.findOne({
      where: {
        mac_number: macAddress,
      },
    });
    if (data) {
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  } catch (err) {
    logger.error(err);
  }
};

exports.createDeviceEntry = async ({ obj, data, sourceData }) => {
  try {
    const uploadData = await aergov_devices.create({
      name: data.name,
      model_id: data.model_id,
      variant_id: data.variant_id,
      version_id: data.id,
      mac_number: obj.mac_address,
      source_file_id: sourceData.id,
      color: obj.color,
      device_type: data.device_type,
    });
    if (!uploadData) {
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  } catch (err) {
    logger.error(err);
  }
};

