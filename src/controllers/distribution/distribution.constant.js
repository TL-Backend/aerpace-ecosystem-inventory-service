exports.successResponses = {
  DEVICE_ASSIGNED: (name) => {
    return `Devices Assigned to distribution ${name}`;
  },
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
};

exports.prefixes = {
  DISTRIBUTION_PREFIX: `dr_`,
};
