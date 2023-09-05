const { statusCodes } = require('../../utils/statusCode');
const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const messages = require('./distribution.constant');

exports.validateInput = (input, validations) => {
  const errorsList = [];

  for (const key in validations) {
    const value = input[key];
    const validation = validations[key];

    if (value === undefined || value === null || !validation(value)) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR(key),
      );
    }
  }

  return errorsList;
};

exports.emailValidation = (value) => {
  // Add your email validation logic here
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return value && value.trim().match(validRegex);
};

exports.stringValidation = (value) =>
  typeof value === 'string' && value.trim().length > 0;

exports.validateDistributionInput = async (req, res, next) => {
  try {
    const {
      distributor_first_name,
      distributor_last_name,
      distributor_country_code,
      distributor_state,
      distributor_phone_number,
      distributor_email,
      distributor_pin_code,
      distribution_name,
      distribution_region,
      distribution_phone_number,
      distribution_email,
      distribution_address,
      distribution_country_code,
    } = req.body;

    const validations = {
      distributor_first_name: this.stringValidation,
      distributor_last_name: this.stringValidation,
      distributor_country_code: this.stringValidation,
      distributor_state: this.stringValidation,
      distributor_phone_number: this.stringValidation,
      distributor_email: this.emailValidation,
      distributor_pin_code: this.stringValidation,
      distribution_name: this.stringValidation,
      distribution_region: this.stringValidation,
      distribution_phone_number: this.stringValidation,
      distribution_email: this.emailValidation,
      distribution_address: this.stringValidation,
      distribution_country_code: this.stringValidation,
    };

    const errorsList = validateInput(req.body, validations);

    if (errorsList.length) {
      throw errorsList.join(', ');
    }

    return next();
  } catch (error) {
    logger.error(error);
    return errorResponse({
      req,
      res,
      error,
      message: error,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};

exports.validateListDistributionInput = async (req, res, next) => {
  try {
    const { region, search, page_limit, page_number } = req.query;
    const errorsList = [];

    if (
      !page_limit ||
      parseInt(page_limit) < 0 ||
      typeof page_limit !== 'string'
    ) {
      errorsList.push(messages.errorMessages.PAGE_NUMBER_MESSAGE);
    }
    if (
      !page_number ||
      parseInt(page_number) < 0 ||
      typeof page_number !== 'string'
    ) {
      errorsList.push(messages.errorMessages.PAGE_LIMIT_MESSAGE);
    }
    if (search && typeof search !== 'string') {
      errorsList.push(messages.errorMessages.INVAILD_SEARCH_KEY);
    }
    if (region && typeof region !== 'string') {
      errorsList.push(messages.errorMessages.INVALID_REGION_FILTER);
    }

    if (errorsList.length) {
      throw errorsList.join(', ');
    }

    return next();
  } catch (error) {
    logger.error(error);
    return errorResponse({
      req,
      res,
      error,
      message: error,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};
