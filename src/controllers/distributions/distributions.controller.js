const {
  errorResponse,
  successResponse,
} = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCodes');
const { logger } = require('../../utils/logger');
const { addDistributionHelper } = require('./distributions.helper');
const messages = require('./distributions.constants');

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
        message: distribution.message
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
