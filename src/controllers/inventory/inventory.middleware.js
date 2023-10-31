const multer = require('multer');
const { errorResponses, fileExtension } = require('./inventory.constant');
const { errorResponse } = require('../../utils/responseHandler');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCode');
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 8000000,
  },
});

exports.importCsvMiddleware = upload.single('csv_file');

exports.importCsvValidation = async (req, res, next) => {
  try {
    const csvData = req.file;
    if (!csvData) {
      throw errorResponses.INVALID_CSV_FILE;
    }
    return next();
  } catch (err) {
    logger.error(err);
    return errorResponse({
      req,
      res,
      err,
      data:{
        response_file_name: null,
        response_file_url: null
      },
      message: err,
      code: statusCodes.STATUS_CODE_INVALID_FORMAT,
    });
  }
};
