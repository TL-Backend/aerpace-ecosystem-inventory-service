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
  IN_PROGRESS: 'INPROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  ERROR: 'false',
  SUCCESS: 'true'
}

exports.csvFields = ['mac_address', 'version_id', 'color', 'status', 'message']

exports.eachLimitValue = 10

exports.activityStatus = {
  ACTIVE: 'ACTIVE',
};

exports.fileExtension = '.csv'

exports.responseFileLocation = 'src/controllers/inventory/output.csv'

exports.s3InputFileLocation = '${process.env.S3_PUBLIC_URL}${process.env.INPUT_FILE_LOCATION}/${file.originalname}'

exports.s3ResponseFileLocation = '${process.env.S3_PUBLIC_URL}${process.env.RESPONSE_FILE_LOCATION}/${file.originalname}'

exports.momentFormat = 'YYYY-MM-DD-HH-mm-ss'