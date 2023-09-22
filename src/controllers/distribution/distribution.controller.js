const { logger } = require('../../utils/logger');
const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');

const { statusCodes } = require('../../utils/statusCode');
const messages = require('./distribution.constant');
const { unassignDevicesHelper, addDistributionHelper,
  listDistributionsHelper,
  editDistributionHelper, } = require('./distribution.helper');


exports.unassignDevices = async (req, res, next) => {
  try {
    const { success, data, message, errorCode } = await unassignDevicesHelper(
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


exports.addDistribution = async (req, res) => {
  try {
    const distributionDetails = req.body;
    const distribution = await addDistributionHelper(distributionDetails);
    if (!distribution.success) {
      logger.error(distribution.message);
      return errorResponse({
        req,
        res,
        code: distribution.errorCode || statusCodes.STATUS_CODE_FAILURE,
        message: distribution.message,
      });
    }
    return successResponse({
      data: distribution.data,
      req,
      res,
      message: messages.successResponses.DISTRIBUTION_ADDED_MESSAGE,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      message: err.message,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};

exports.editDistribution = async (req, res) => {
  try {
    const distributionDetails = req.body;
    const distribution = await editDistributionHelper(
      distributionDetails,
      req.params.id,
    );
    if (!distribution.success) {
      return errorResponse({
        req,
        res,
        code: distribution.code || statusCodes.STATUS_CODE_FAILURE,
        error: distribution.data,
        message: distribution.message,
      });
    }
    return successResponse({
      data: distributionDetails,
      req,
      res,
      message: messages.successResponses.DISTRIBUTION_UPDATED_MESSAGE,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
    });
  }
};

exports.listDistributions = async (req, res) => {
  try {
    const params = req.query;
    const distribution = await listDistributionsHelper(params);
    if (!distribution.success) {
      logger.error(distribution.data);
      return errorResponse({
        req,
        res,
        code: statusCodes.STATUS_CODE_FAILURE,
        error: distribution.data,
        message: distribution.message,
      });
    }
    return successResponse({
      data: distribution.data,
      req,
      res,
      message: messages.successResponses.DISTRIBUTIONS_FETCHED_MESSAGE,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
    });
  }
};
