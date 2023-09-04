const { statusCodes } = require('../../utils/statusCodes');
const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const messages = require('./distributions.constants');
const { dbTables } = require('../../utils/constants');
const { validateDataInDBById } = require('./distributions.helper');

exports.validateDistributionInput = async (req, res, next) => {
  try {
    const {
        distribution_name,
        distribution_email,
        distribution_region,
        distribution_phone_number,
        distribution_address,
        distribution_country_code,
        distributor_first_name,
        distributor_last_name,
        distributor_country_code,
        distributor_phone_number,
        distributor_email,
        distributor_address,
        distributor_pin_code,
        distributor_state
    } = req.body;
    const errorsList = [];
    if (!distributor_first_name?.trim() || typeof distributor_first_name !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distributor_first_name'),
      );
    }
    if (!distribution_region?.trim() || typeof distribution_region !== 'string') {
        errorsList.push(
          messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_region'),
        );
      }
    if (!distribution_name?.trim() || typeof distribution_name !== 'string') {
        errorsList.push(
          messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_name'),
        );
      }
    if (!distributor_last_name?.trim() || typeof distributor_last_name !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distributor_last_name'),
      );
    }
    if (!distributor_country_code?.trim() || typeof distributor_country_code !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distributor_country_code'),
      );
    }
    if (!distributor_state?.trim() || typeof distributor_state !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distributor_state'),
      );
    }
    if (!distributor_phone_number?.trim() || typeof distributor_phone_number !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distributor_phone_number'),
      );
    }
    if (!distribution_phone_number?.trim() || typeof distribution_phone_number !== 'string') {
        errorsList.push(
          messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_phone_number'),
        );
      }
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!distributor_email?.trim() || !distributor_email.match(validRegex)) {
      errorsList.push(messages.errorMessages.INVAILD_EMAIL_FORMAT_MESSAGE);
    }
    if (!distribution_email?.trim() || !distribution_email.match(validRegex)) {
        errorsList.push(messages.errorMessages.INVAILD_EMAIL_FORMAT_MESSAGE);
      }
    if (!distributor_pin_code?.trim() || typeof distributor_pin_code !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distributor_pin_code'),
      );
    }
    if (!distribution_country_code?.trim() || typeof distribution_country_code !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_country_code'),
      );
    }
    if (!distributor_address?.trim() || typeof distributor_address !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distributor_address'),
      );
    }
    if (!distribution_address?.trim() || typeof distribution_address !== 'string') {
        errorsList.push(
          messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_address'),
        );
      }
    if (errorsList.length) {
      throw errorsList.join(' ,');
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

exports.validateEditDistributionInput = async (req, res, next) => {
  try {
    const {
        distribution_name,
        distribution_region,
        distribution_phone_number,
        distribution_address,
        distribution_country_code,
    } = req.body;
    const distribution_id = req.params.id;
    if (!distribution_id?.trim() || typeof distribution_id !== 'string' || !distribution_id?.startsWith('dr')) {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_id'),
      );
    }
    if(distribution_id?.startsWith('dr')){
      const distribution = validateDataInDBById(distribution_id, dbTables.DISTRIBUTION_TABLE);
      if (!distribution.data || !distribution.success) {
        errorsList.push(messages.errorMessages.NO_DISTRIBUTION_FOUND);
      }
    }
    const errorsList = [];
    if (!distribution_region?.trim() || typeof distribution_region !== 'string') {
        errorsList.push(
          messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_region'),
        );
      }
    if (!distribution_name?.trim() || typeof distribution_name !== 'string') {
        errorsList.push(
          messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_name'),
        );
      }
    if (!distribution_phone_number?.trim() || typeof distribution_phone_number !== 'string') {
        errorsList.push(
          messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_phone_number'),
        );
      }
    if (!distribution_country_code?.trim() || typeof distribution_country_code !== 'string') {
      errorsList.push(
        messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_country_code'),
      );
    }
    if (!distribution_address?.trim() || typeof distribution_address !== 'string') {
        errorsList.push(
          messages.errorMessages.INVAILD_STRING_OR_MISSING_ERROR('distribution_address'),
        );
      }
    if (errorsList.length) {
      throw errorsList.join(' ,');
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