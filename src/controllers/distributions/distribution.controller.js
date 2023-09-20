const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCode');
const { logger } = require('../../utils/logger');
const {
  addDistributionHelper,
  listDistributionsHelper,
  editDistributionHelper,
} = require('./distribution.helper');
const messages = require('./distribution.constant');

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
      message: messages.successMessages.DISTRIBUTION_ADDED_MESSAGE,
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
      message: messages.successMessages.DISTRIBUTIONS_FETCHED_MESSAGE,
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
