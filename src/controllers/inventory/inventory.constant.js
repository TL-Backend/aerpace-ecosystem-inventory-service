exports.successResponses = {
  PROCESS_COMPLETED: 'process completed successfully',
  FILE_UPLOADED_SUCCESSFULLY: 'File uploaded successfully:',
  FILE_DELETED_SUCCESSFULLY: 'File deleted successfully'
};

exports.errorResponses = {
  INVALID_CSV_FILE: 'Invalid csv file or No file uploaded',
  INVALID_CSV_FORMAT: 'Invalid csv format',
  INVALID_MAC_ADDRESS: 'Invalid mac address',
  INVALID_VERSION_ID: 'Invalid version id',
  INVALID_COLOR: 'Invalid color or color is empty',
  INTERNAL_ERROR: 'Internal error',
  IN_PROGRESS: 'Inporgress',
  PROCESS_FAILED: 'Process failed',
  DUPLICATE_DATA: 'Duplicate data',
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