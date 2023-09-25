exports.dbTables = {
  DEVICES_TABLE: `aergov_devices`,
  USERS_TABLE: 'aergov_users',
  USER_ROLES_TABLE: 'aergov_user_roles',
  DISTRIBUTIONS_TABLE: 'aergov_distributions',
  DEVICE_MODELS_TABLE: 'aergov_device_models',
  DEVICE_TABLE: 'aergov_devices',
  DEVICE_VERSION_TABLE: 'aergov_device_versions',
  DEVICE_VARIANT_TABLE: 'aergov_device_variants',
  AERGOV_DISTRIBUTION: 'aergov_distributions',
  IMPORT_HISTORY_TABLE: 'aergov_device_import_histories',
  DEVICES_IMPORT_HISTORY: 'aergov_device_import_histories',
};

exports.successResponses = {
  SUCCESS: `operation performed successfully`,
};

exports.errorResponses = {
  FAILURE: `Failed to perform the operation`,
};

exports.levelStarting = {
  version: 'ver_',
};
