const multer = require('multer');
const { errorResponses, fileExtension } = require('./inventory.constant');
const { errorResponse } = require('../../utils/responseHandler');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCodes');
const storage = multer.memoryStorage();
const upload = multer({ dest: 'uploads/'});

exports.importCsvMiddleware = upload.single('csv_file');

exports.importCsvValidation = async (req, res, next) => {
  try {
    const csvData = req.file
    if (!csvData || !csvData.originalname.endsWith(fileExtension)) {
      throw errorResponses.INVALID_CSV_FILE
    }
    return next()
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      err,
      message: err,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
}