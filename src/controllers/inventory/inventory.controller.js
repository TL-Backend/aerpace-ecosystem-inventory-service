const { logger } = require("../../utils/logger");
const { errorResponse, successResponse } = require("../../utils/responseHandler");
const { statusCodes } = require("../../utils/statusCodes");
const { errorResponses } = require("./inventory.constant");
const { extractCsv } = require("./inventory.helper");

exports.importCsv = async (req, res, next) => {
  try {
    const csv_file = req.file
    const { success, errorCode, message, data } = await extractCsv({ csvFile: csv_file })
    if(!success){
      return errorResponse({
        req,
        res,
        code: errorCode,
        message: message,
      });
    }
    return successResponse({
      res,
      data,
      message,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      error: err,
    });
  }
}