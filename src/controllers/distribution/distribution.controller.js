const { logger } = require('../../utils/logger');
const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCodes');
const { assignDevicesHelper } = require('./distribution.helper');

exports.assignDevices = async (req, res, next) => {
  try {
    const { success, data, message, errorCode } = await assignDevicesHelper(
      req.body,
    );

    if (!success) {
      return errorResponse({
        req,
        res,
        code: errorCode,
        message,
      });
    }

    return successResponse({
      req,
      res,
      data,
      message,
    });
  } catch (err) {
    logger.error(err.message);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
    });
  }
};
