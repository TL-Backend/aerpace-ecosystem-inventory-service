const { statusCodes } = require('../../utils/statusCodes');
const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const messages = require('./distribution.constant');

const validateInput = (input, validations) => {
  const errorsList = [];

  for (const key in validations) {
    const value = input[key];
    const validation = validations[key];

    if (value === undefined || value === null || !validation(value)) {
      errorsList.push(messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR(key));
    }
  }

  return errorsList;
};

const emailValidation = (value) => {
  // Add your email validation logic here
  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return value && value.trim().match(validRegex);
};

const stringValidation = (value) => typeof value === 'string' && value.trim().length > 0;

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
      distributor_first_name: stringValidation,
      distributor_last_name: stringValidation,
      distributor_country_code: stringValidation,
      distributor_state: stringValidation,
      distributor_phone_number: stringValidation,
      distributor_email: emailValidation,
      distributor_pin_code: stringValidation,
      distribution_name: stringValidation,
      distribution_region: stringValidation,
      distribution_phone_number: stringValidation,
      distribution_email: emailValidation,
      distribution_address: stringValidation,
      distribution_country_code: stringValidation,
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


