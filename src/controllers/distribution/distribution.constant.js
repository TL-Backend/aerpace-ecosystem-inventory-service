exports.successResponses = {
  DEVICE_ASSIGNED: (name) => {
    return `Devices Assigned to distribution ${name}`;
  },
  DISTRIBUTION_ADDED_MESSAGE: 'Distribution created successfully',
  DISTRIBUTION_UPDATED_MESSAGE: 'Distribution updated successfully',
  DISTRIBUTIONS_FETCHED_MESSAGE: 'Distributions fetched successfully',
  DATA_FETCHED: `Data fetched successfully`,
};

exports.errorResponses = {
  DISTRIBUTION_NOT_FOUND: (id) => {
    return `Distribution not found with id: ${id}`;
  },
  NO_DEVICES_FOUND: `There are invalid device mac_addresses in the set of mac_addresses you have provided`,
  INVALID_DISTRIBUTION_ID: `Distribution Id is required, it should be of type string and should start with dr_`,
  INVALID_DEVICES: `List of devices are required`,
  EMPTY_LIST_DEVICES: `Devices cannot be empty`,
  INVALID_DEVICE_TYPE: `Devices should only contain strings`,
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
  DISTRIBUTIONS_EXIST_WITH_THIS_EMAIL:
    'distribution already exist with this email',
};

exports.defaults = {
  DEFAULT_DISTRIBUTION_ROLE_NAME: `Distributor`,
  USER_TYPE: `USER`,
};

exports.routes = {
  POST_USERS: `api/v1/users`,
};

exports.prefixes = {
  DISTRIBUTION_PREFIX: `dr_`,
};
