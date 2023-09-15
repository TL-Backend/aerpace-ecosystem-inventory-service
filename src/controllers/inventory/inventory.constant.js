exports.successResponses = {
  PROCESS_COMPLETED: 'process completed successfully',
};

exports.errorResponses = {
  INVALID_CSV_FILE: 'invalid csv file or No file uploaded',
  INVALID_MAC_ADDRESS: 'invalid mac address',
  INVALID_VERSION_ID: 'invalid version id',
  INVALID_COLOR: 'invalid color or color is empty',
  INTERNAL_ERROR: 'internal error',
  IN_PROGRESS: 'inporgress',
  PROCESS_FAILED: 'process failed',
  DUPLICATE_DATA: 'duplicate data'
};

exports.status = {
  IN_PROGRESS: 'inprogress',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  ERROR: 'false',
  SUCCESS: 'true'
}

exports.eachLimitValue = 10

exports.activityStatus = {
  ACTIVE: 'ACTIVE',
};

exports.fileExtension = '.csv'