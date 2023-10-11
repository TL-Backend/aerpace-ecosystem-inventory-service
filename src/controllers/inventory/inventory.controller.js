const { logger } = require('../../utils/logger');
const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCode');
const { successResponses } = require('./inventory.constant');
const {
  getInventory,
  getInventoryImportHistory,
} = require('./inventory.helper');
const messages = require('./inventory.constant');
const { processCsvFile } = require('./inventory.helper');

exports.listInventory = async (req, res, next) => {
  try {
    let {
      success,
      errorCode,
      message,
      data: inventoryData,
    } = await getInventory({ params: req.query });
    if (!success) {
      return errorResponse({
        res,
        code: errorCode,
        message,
      });
    }
    return successResponse({
      res,
      data: inventoryData,
      message: successResponses.DATA_FETCH_SUCCESSFUL,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      error: err,
    });
  }
};

exports.getImportHistoryList = async (req, res, next) => {
  try {
    const { success, data, message, errorCode } =
      await getInventoryImportHistory(req);

    if (!success) {
      logger.error(message);
      return errorResponse({
        req,
        res,
        code: errorCode,
        message,
      });
    }

    return successResponse({
      data,
      req,
      res,
      message: messages.successResponses.CSV_IMPORT_HISTORY_FETCHED_MESSAGE,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (error) {
    logger.error(error.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};

exports.importCsv = async (req, res, next) => {
  try {
    const csv_file = req.file;
    const { userId } = req.query;
    const { success, errorCode, message, data } = await processCsvFile({
      csvFile: csv_file,
      userId,
    });
    if (!success) {
      return errorResponse({
        req,
        res,
        code: errorCode,
        message: message,
      });
    }
    return successResponse({
      res,
      code: errorCode,
      data,
      message,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      error: err,
    });
  }
};
