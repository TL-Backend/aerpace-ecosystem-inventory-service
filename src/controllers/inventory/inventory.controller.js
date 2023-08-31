const { logger } = require("../../utils/logger")
const { errorResponse, successResponse } = require("../../utils/responseHandler")
const { statusCodes } = require("../../utils/statusCodes")
const { successResponses } = require("./inventory.constants")
const { getInventory } = require("./inventory.helper")

exports.listInventory = async (req, res, next) => {
  try {
    let { pageLimit, pageNumber, status } = req.query
    pageLimit = pageLimit.trim()
    pageNumber = pageNumber.trim()
    status = status.trim()
    let { data: inventoryData } = await getInventory(req.query)
    const startIndex = (pageNumber - 1) * pageLimit
    const endIndex = parseInt(startIndex) + parseInt(pageLimit)
    let paginatedData;
    if (status === "0") {
      const unassignedData = inventoryData.filter(data => data.distributor_id === "null");
      paginatedData = unassignedData.slice(startIndex, endIndex)
    }
    else if (status === "1") {
      const assignedData = inventoryData.filter(data => data.distributor_id !== "null");
      paginatedData = assignedData.slice(startIndex, endIndex)
    }
    else {
      paginatedData = inventoryData.slice(startIndex, endIndex)
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