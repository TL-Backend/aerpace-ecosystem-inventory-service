const { getPaginationQuery } = require("../../services/aerpace-ecosystem-backend-db/src/commons/common.query")
const { logger } = require("../../utils/logger")
const { errorResponse, successResponse } = require("../../utils/responseHandler")
const { statusCodes } = require("../../utils/statusCode")
const { successResponses } = require("./inventory.constant")
const { getInventory } = require("./inventory.helper")

exports.listInventory = async (req, res, next) => {
  try {
    let { page_limit: pageLimit, page_number: pageNumber } = req.query
    if (pageLimit) {
      pageLimit = pageLimit.trim()
    }
    if (pageNumber) {
      pageNumber = pageNumber.trim()
    }
    const paginationQuery = getPaginationQuery({ pageLimit, pageNumber })
    let { success, errorCode, message, data: inventoryData } = await getInventory({ params: req.query, paginationQuery })
    if (!success) {
      return errorResponse({
        res,
        code: errorCode,
        message,
      });
    }
    return successResponse({
      res,
      data: inventoryData,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      code: statusCodes.STATUS_CODE_SUCCESS,
    });
  } catch (err) {
    logger.error(err)
    return errorResponse({
      res,
      code: statusCodes.STATUS_CODE_FAILURE,
      error: err,
    });
  }
}