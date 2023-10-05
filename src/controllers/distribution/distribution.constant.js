exports.successResponses = {
  DEVICE_ASSIGNED: (name) => {
    return `Devices Assigned to distribution ${name}`;
  },
  DEVICE_UNASSIGNED: (name) => {
    return `Devices unassigned to distribution ${name} successfully`;
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
  INVALID_STRING_OR_MISSING_ERROR: (value) => {
    return `${value} should be present and it must be an string`;
  },
  INVALID_FORMAT_ERROR: (value) => {
    return `${value} contains invalid data`;
  },
  FAILED_TO_ASSIGN_DEVICES: (values) => {
    return `Unable to assign devices with Id's: ${values}`;
  },
  FAILED_TO_UNASSIGN_DEVICES: (values) => {
    return `Unable to unassign devices with Id's: ${values}`;
  },
  NO_DEVICES_FOUND: `There are invalid device mac_addresses in the set of mac_addresses you have provided`,
  INVALID_DISTRIBUTION_ID: `Distribution Id is required, it should be of type string and should start with dr_`,
  INVALID_DEVICES: `List of devices are required`,
  EMPTY_LIST_DEVICES: `Devices cannot be empty`,
  INVALID_DEVICE_TYPE: `Devices should only contain strings`,
  INVALID_EMAIL_FORMAT_MESSAGE: 'Invalid email format',
  INVALID_SEARCH_KEY: 'Invalid search key, it should be string!',
  PAGE_LIMIT_MESSAGE: 'Page limit should be positive',
  PAGE_NUMBER_MESSAGE: 'Page number should be positive',
  INVALID_REGION_FILTER: 'Invalid region filter, it should be a string',
  NO_DISTRIBUTION_FOUND: 'No distribution found with this id',
  ERROR_FOUND: `Error while performing the operations`,
  INVALID_DISTRIBUTION: `Provided distribution id is invalid`,
  DISTRIBUTIONS_EXIST_WITH_THIS_EMAIL:
    'Distribution already exist with this email',
  INTERNAL_ERROR: `Something went wrong`,
  DISTRIBUTION_NOT_FOUND: `Distribution not found`,
};

exports.defaults = {
  DEFAULT_DISTRIBUTION_ROLE_NAME: `Distributor`,
  USER_TYPE: `USER`,
};

exports.routes = {
  POST_USERS: `/users`,
  UPDATE_USERS: ({ id }) => {
    return `users/${id}`;
  },
  DELETE_USERS: ({ id }) => {
    return `users/hard-delete/${id}`;
  },
};

exports.prefixes = {
  DISTRIBUTION_PREFIX: `dr_`,
};
