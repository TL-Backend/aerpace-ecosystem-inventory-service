exports.errorResponses = {
  INVAILD_STRING_OR_MISSING_ERROR: (value) => {
    return `${value} should be present and it must be an string`;
  },
  INVAILD_FORMAT_ERROR: (value) => {
    return `${value} contains invalid data`;
  },
  INVAILD_EMAIL_FORMAT_MESSAGE: 'Invalid email format',
  INVAILD_SEARCH_KEY: 'Invalid search key, it should be string!',
  PAGE_LIMIT_MESSAGE: 'Page limit should be positive',
  PAGE_NUMBER_MESSAGE: 'Page number should be positive',
  INVALID_REGION_FILTER: 'Invalid region filter, it should be a string',
  NO_DISTRIBUTION_FOUND: 'No distribution found with this id',
  ERROR_FOUND: `Error while performing the operations`,
  INVALID_DISTRIBUTION_ID: `Provided distribution id is invalid`,
};

exports.successResponses = {
  DISTRIBUTION_ADDED_MESSAGE: 'Distribution created successfully',
  DISTRIBUTION_UPDATED_MESSAGE: 'Distribution updated successfully',
  DISTRIBUTIONS_FETCHED_MESSAGE: 'Distributions fetched successfully',
  DATA_FETCHED: `Data fetched successfully`,
};

exports.defaults = {
  DEFAULT_DISTRIBUTION_ROLE_NAME: `Distributor`,
  USER_TYPE: `USER`,
};

exports.routes = {
  POST_USERS: `api/v1/users`,
};
