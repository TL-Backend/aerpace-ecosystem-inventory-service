const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCode');
const { logger } = require('../../utils/logger');
const {
  addDistributionHelper,
  editDistributionHelper,
} = require('./distribution.helper');
const messages = require('./distribution.constant');

exports.addDistribution = async (req, res) => {
  try {
    const distributionDetails = req.body;
    const distribution = await addDistributionHelper(distributionDetails);
    if (!distribution.success) {
      logger.error(distribution.data);
      return errorResponse({
        req,
        res,
        code: statusCodes.STATUS_CODE_FAILURE,
        error: distribution.data,
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
      message: messages.successMessages.DISTRIBUTION_UPDATED_MESSAGE,
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
