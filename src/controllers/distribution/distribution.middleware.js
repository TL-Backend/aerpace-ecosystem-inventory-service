const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCodes');
const { errorResponses, prefixes } = require('./distribution.constant');

exports.validateUnassignDevices = async (req, res, next) => {
  try {
    const { distribution_id: distributionId, devices } = req.body;
    let errorList = [];
    let errorsInDevices = [];

    if (
      !distributionId ||
      typeof distributionId !== 'string' ||
      !distributionId.startsWith(prefixes.DISTRIBUTION_PREFIX)
    ) {
      errorList.push(errorResponses.INVALID_DISTRIBUTION_ID);
    }

    if (!devices || typeof devices !== 'object') {
      errorList.push(errorResponses.INVALID_DEVICES);
    }

    if (devices) {
      if (!devices.length) {
        errorList.push(errorResponses.EMPTY_LIST_DEVICES);
      }
      devices?.forEach((device) => {
        if (typeof device !== 'string') {
          errorsInDevices.push(errorResponses.INVALID_DEVICE_TYPE);
        }
      });
    }

    if (errorsInDevices.length) {
      errorList.push(...new Set(errorsInDevices));
    }

    if (errorList.length) {
      throw errorList.join(', ');
    }

    return next();
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      message: err,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};
