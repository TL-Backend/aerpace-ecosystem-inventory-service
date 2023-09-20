const { logger } = require('../../utils/logger');
const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCode');
const messages = require('./inventory.constant');
const { getInventoryImportHistory } = require('./inventory.helper');

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
      message: messages.successMessages.CSV_IMPORT_HISTORY_FETCHED_MESSAGE,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (error) {
    logger.error(error);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};
