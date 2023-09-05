const { check, validationResult } = require('express-validator');
const { errorResponses } = require('./inventory.constant');
const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCodes');
const { logger } = require('../../utils/logger');

exports.listInventoryValidations = async (req, res, next) => {
  try {
    const errorsList = [];
    let { page_limit: pageLimit, page_number: pageNumber } = req.query
    console.log(pageLimit,pageNumber);
    if (!pageLimit) {
      errorsList.push(errorResponses.PAGE_LIMIT_INVALID);
    }
    if (!pageNumber) {
      errorsList.push(errorResponses.PAGE_NUMBER_INVALID);
    }
    if (errorsList.length) {
      throw errorsList.join();
    }
    next();
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      err,
      message: err,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
}
