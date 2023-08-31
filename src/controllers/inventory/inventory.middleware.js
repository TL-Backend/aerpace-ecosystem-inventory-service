const { check, validationResult } = require('express-validator');
const { errorResponses } = require('./inventory.constants');
const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCodes');

exports.listInventoryValidation = [
  check('pageLimit').trim()
    .notEmpty()
    .withMessage(errorResponses.PAGE_LIMIT_INVALID.message),
  check('pageNumber').trim()
    .notEmpty()
    .withMessage(errorResponses.PAGE_NUMBER_INVALID.message),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse({
        req,
        res,
        code: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: errors.errors[0].msg,
      });
    }
    next();
  },
];