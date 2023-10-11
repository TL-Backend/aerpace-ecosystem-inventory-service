exports.successResponses = {
  default: {
    statusCode: 200,
    message: '',
  },
  DATA_FETCH_SUCCESSFUL: 'data fetched successfully',
  CSV_IMPORT_HISTORY_FETCHED_MESSAGE:
    'Inventory import history fetched successfully',
  PROCESS_COMPLETED: 'Process completed successfully',
  FILE_UPLOADED_SUCCESSFULLY: 'File uploaded successfully',
  FILE_DELETED_SUCCESSFULLY: 'File deleted successfully',
};

exports.errorResponses = {
  default: {
    message: '',
  },
  PAGE_LIMIT_INVALID: 'PageLimit is empty or invalid',
  PAGE_NUMBER_INVALID: 'PageNumber is empty or invalid',
  INVALID_CSV_FILE: 'Invalid csv file or No file uploaded',
  INVALID_CSV_FORMAT: 'Invalid csv format',
  INVALID_MAC_ADDRESS: 'Inproper mac address',
  MAC_ADDRESS_ALREADY_EXISTS: 'Mac address already exists',
  INVALID_CSV_HEADERS: 'Invalid csv headers',
  INVALID_VERSION_ID: 'Inproper version id',
  VERSION_ID_NOT_EXISTS: 'Version id doesnt exists',
  INVALID_COLOR: 'Color is empty',
  INTERNAL_ERROR: 'Something went wrong',
  IN_PROGRESS: 'In progress',
  PROCESS_FAILED: 'Process failed',
  DUPLICATE_DATA: 'Duplicate entry',
  DB_FAILED: 'Something went wrong',
};

exports.filterCondition = {
  MODEL_NAME: `adm.name`,
  VARIANT_NAME: `adva.name`,
  VERSION_NAME: `adve.name`,
  DISTRIBUTION_NAME: `ad.distribution_id`,
  COLOR: `ad.color`,
};

exports.sortOrder = `ORDER BY ad.created_at DESC`;

exports.deviceStatus = {
  ASSIGNED: 'ASSIGNED',
  UNASSIGNED: 'UNASSIGNED',
};

exports.status = {
  IN_PROGRESS: 'INPROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  PARTIALLY_COMPLETED: 'PARTIALLY_COMPLETED',
  ERROR: 'ERROR_EXISTS',
  SUCCESS: 'SUCCESSFUL',
};

exports.statusMessage = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  PARTIALLY_COMPLETED: 'partially completed',
};

exports.keyWords = {
  process: `Process`,
};

exports.csvMandatoryHeaders = ['mac address', 'version id', 'color'];

exports.csvInputExcludedHeaders = ['status', 'message'];

exports.csvResponseHeaders = [
  'mac address',
  'version id',
  'color',
  'status',
  'message',
];

exports.eachLimitValue = 10;

exports.activityStatus = {
  ACTIVE: 'ACTIVE',
};

exports.fileExtension = '.csv';

exports.responseFileLocation = 'src/controllers/inventory/output.csv';

exports.s3InputFileLocation =
  '${process.env.S3_PUBLIC_URL}${process.env.INPUT_FILE_LOCATION}/${file.originalname}';

exports.s3ResponseFileLocation =
  '${process.env.S3_PUBLIC_URL}${process.env.RESPONSE_FILE_LOCATION}/${file.originalname}';

exports.momentFormat = 'YYYY-MM-DD-HH-mm-ss';
