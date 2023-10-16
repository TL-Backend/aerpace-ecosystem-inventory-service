const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const { statusCodes } = require('../../utils/statusCode');
const { errorResponses, prefixes } = require('./distribution.constant');
const messages = require('./distribution.constant');

exports.validateInputToAssignOrUnassignDevices = async (req, res, next) => {
  try {
    const { distribution_id: distributionId, devices } = req.body;
    let errorList = [];

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

exports.validateDistributionInput = async (req, res, next) => {
  try {
    const {
      name: name,
      email: distribution_email,
      address: address,
      region: region,
      phone_number: phone_number,
      country_code: country_code,
      distributor,
    } = req.body;

    const {
      first_name: distributor_first_name,
      last_name: distributor_last_name,
      email: distributor_email,
      address: distributor_address,
      phone_number: distributor_phone_number,
      country_code: distributor_country_code,
      state: distributor_state,
      pin_code: distributor_pin_code,
    } = distributor;

    const errorsList = [];
    if (
      typeof distributor_first_name !== 'string' ||
      !distributor_first_name?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'distributor_first_name',
        ),
      );
    }
    if (
      typeof region !== 'string' ||
      !region?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'region',
        ),
      );
    }
    if (typeof name !== 'string' || !name?.trim()) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'name',
        ),
      );
    }
    if (
      typeof distributor_last_name !== 'string' ||
      !distributor_last_name?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'distributor_last_name',
        ),
      );
    }
    if (
      typeof distributor_country_code !== 'string' ||
      !distributor_country_code?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'distributor_country_code',
        ),
      );
    }
    if (typeof distributor_state !== 'string' || !distributor_state?.trim()) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'distributor_state',
        ),
      );
    }
    if (
      typeof distributor_phone_number !== 'string' ||
      !distributor_phone_number?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'distributor_phone_number',
        ),
      );
    }
    if (
      typeof phone_number !== 'string' ||
      !phone_number?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'phone_number',
        ),
      );
    }
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!distributor_email?.trim() || !distributor_email.match(validRegex)) {
      errorsList.push(messages.errorResponses.INVALID_EMAIL_FORMAT_MESSAGE);
    }

    if (!distribution_email?.trim() || !distribution_email.match(validRegex)) {
      errorsList.push(messages.errorResponses.INVALID_EMAIL_FORMAT_MESSAGE);
    }

    if (
      typeof distributor_pin_code !== 'string' ||
      !distributor_pin_code?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'distributor_pin_code',
        ),
      );
    }

    if (
      typeof country_code !== 'string' ||
      !country_code?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'country_code',
        ),
      );
    }

    if (
      typeof distributor_address !== 'string' ||
      !distributor_address?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'distributor_address',
        ),
      );
    }

    if (
      typeof address !== 'string' ||
      !address?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'address',
        ),
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

exports.validateListDistributionInput = async (req, res, next) => {
  try {
    const { region, search, page_limit, page_number } = req.query;
    const errorsList = [];

    if (page_limit && parseInt(page_limit) < 0) {
      errorsList.push(messages.errorResponses.PAGE_NUMBER_MESSAGE);
    }
    if (page_number && parseInt(page_number) < 0) {
      errorsList.push(messages.errorResponses.PAGE_LIMIT_MESSAGE);
    }
    if (search && typeof search !== 'string') {
      errorsList.push(messages.errorResponses.INVALID_SEARCH_KEY);
    }
    if (region && typeof region !== 'string') {
      errorsList.push(messages.errorResponses.INVALID_REGION_FILTER);
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

exports.validateEditDistributionInput = async (req, res, next) => {
  try {
    const {
      name,
      region,
      phone_number,
      address,
      country_code,
    } = req.body;
    const distribution_id = req.params.id;
    const errorsList = [];

    if (
      typeof distribution_id !== 'string' ||
      !distribution_id?.trim() ||
      !distribution_id?.startsWith('dr')
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_STRING_OR_MISSING_ERROR(
          'distribution_id',
        ),
      );
    }

    if (
      region &&
      (typeof region !== 'string' || !region?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_FORMAT_ERROR('region'),
      );
    }

    if (
      name &&
      (typeof name !== 'string' || !name?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_FORMAT_ERROR('name'),
      );
    }

    if (
      phone_number &&
      (typeof phone_number !== 'string' ||
        !phone_number?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_FORMAT_ERROR(
          'phone_number',
        ),
      );
    }

    if (
      country_code &&
      (typeof country_code !== 'string' ||
        !country_code?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_FORMAT_ERROR(
          'country_code',
        ),
      );
    }

    if (
      address &&
      (typeof address !== 'string' ||
        !address?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVALID_FORMAT_ERROR('address'),
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
