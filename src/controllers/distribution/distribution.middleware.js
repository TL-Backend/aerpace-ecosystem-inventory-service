const { logger } = require('../../utils/logger');
const { errorResponse } = require('../../utils/responseHandler');
const { errorResponses, prefixes } = require('./distribution.constant');
const { statusCodes } = require('../../utils/statusCode');
const messages = require('./distribution.constant');

exports.validateUnassignDevices = async (req, res, next) => {
  try {
    const { distribution_id: distributionId, devices } = req.body;
    let errorList = [];
    let errorsInDevices = [];

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
      devices?.forEach((device) => {
        if (typeof device !== 'string') {
          errorsInDevices.push(errorResponses.INVALID_DEVICE_TYPE);
        }
      });
    }

    if (errorsInDevices.length) {
      errorList.push(...new Set(errorsInDevices));
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
      distributor_state,
    } = req.body;
    const errorsList = [];
    if (
      typeof distributor_first_name !== 'string' ||
      !distributor_first_name?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distributor_first_name',
        ),
      );
    }
    if (
      typeof distribution_region !== 'string' ||
      !distribution_region?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distribution_region',
        ),
      );
    }
    if (typeof distribution_name !== 'string' || !distribution_name?.trim()) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distribution_name',
        ),
      );
    }
    if (
      typeof distributor_last_name !== 'string' ||
      !distributor_last_name?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distributor_last_name',
        ),
      );
    }
    if (
      typeof distributor_country_code !== 'string' ||
      !distributor_country_code?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distributor_country_code',
        ),
      );
    }
    if (typeof distributor_state !== 'string' || !distributor_state?.trim()) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distributor_state',
        ),
      );
    }
    if (
      typeof distributor_phone_number !== 'string' ||
      !distributor_phone_number?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distributor_phone_number',
        ),
      );
    }
    if (
      typeof distribution_phone_number !== 'string' ||
      !distribution_phone_number?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distribution_phone_number',
        ),
      );
    }
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!distributor_email?.trim() || !distributor_email.match(validRegex)) {
      errorsList.push(messages.errorResponses.INVAILD_EMAIL_FORMAT_MESSAGE);
    }
    if (!distribution_email?.trim() || !distribution_email.match(validRegex)) {
      errorsList.push(messages.errorResponses.INVAILD_EMAIL_FORMAT_MESSAGE);
    }
    if (
      typeof distributor_pin_code !== 'string' ||
      !distributor_pin_code?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distributor_pin_code',
        ),
      );
    }
    if (
      typeof distribution_country_code !== 'string' ||
      !distribution_country_code?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distribution_country_code',
        ),
      );
    }
    if (
      typeof distributor_address !== 'string' ||
      !distributor_address?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distributor_address',
        ),
      );
    }
    if (
      typeof distribution_address !== 'string' ||
      !distribution_address?.trim()
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distribution_address',
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
      errorsList.push(messages.errorResponses.INVAILD_SEARCH_KEY);
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
      distribution_name,
      distribution_region,
      distribution_phone_number,
      distribution_address,
      distribution_country_code,
    } = req.body;
    const distribution_id = req.params.id;
    const errorsList = [];
    if (
      typeof distribution_id !== 'string' ||
      !distribution_id?.trim() ||
      !distribution_id?.startsWith('dr')
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_STRING_OR_MISSING_ERROR(
          'distribution_id',
        ),
      );
    }
    if (
      distribution_region &&
      (typeof distribution_region !== 'string' || !distribution_region?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_FORMAT_ERROR('distribution_region'),
      );
    }
    if (
      distribution_name &&
      (typeof distribution_name !== 'string' || !distribution_name?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_FORMAT_ERROR('distribution_name'),
      );
    }
    if (
      distribution_phone_number &&
      (typeof distribution_phone_number !== 'string' ||
        !distribution_phone_number?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_FORMAT_ERROR(
          'distribution_phone_number',
        ),
      );
    }
    if (
      distribution_country_code &&
      (typeof distribution_country_code !== 'string' ||
        !distribution_country_code?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_FORMAT_ERROR(
          'distribution_country_code',
        ),
      );
    }
    if (
      distribution_address &&
      (typeof distribution_address !== 'string' ||
        !distribution_address?.trim())
    ) {
      errorsList.push(
        messages.errorResponses.INVAILD_FORMAT_ERROR('distribution_address'),
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
