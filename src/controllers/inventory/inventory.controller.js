const { logger } = require("../../utils/logger")
const { errorResponse, successResponse } = require("../../utils/responseHandler")
const { statusCodes } = require("../../utils/statusCodes")
const { successResponses } = require("./inventory.constants")
const { getInventory, paginateData } = require("./inventory.helper")

exports.listInventory = async (req, res, next) => {
  try {
    let { page_limit: pageLimit, page_number: pageNumber, device_assign_status: deviceAssignStatus } = req.query
    pageLimit = pageLimit.trim()
    pageNumber = pageNumber.trim()
    if (deviceAssignStatus) {
      deviceAssignStatus = deviceAssignStatus.trim()
    }
    let { success, errorCode, message, data: inventoryData } = await getInventory({ params: req.query })
    if (!success) {
      return errorResponse({
        res,
        code: errorCode,
        message,
      });
    }
    const { success: paginationStatus, errorCode: paginationErrorCode, message: paginationMessage, data: paginatedData } = await paginateData({ pageLimit, pageNumber, deviceAssignStatus, inventoryData })
    if (!paginationStatus) {
      return errorResponse({
        res,
        code: paginationErrorCode,
        message: paginationMessage,
      });
    }
    return successResponse({
      res,
      data: paginatedData,
      message: successResponses.DATA_FETCH_SUCCESSFULL.message,
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