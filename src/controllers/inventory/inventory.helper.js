const { sequelize } = require("../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models")
const { logger } = require("../../utils/logger")
const { filterCondition, successResponses } = require("./inventory.constants")
const { queries } = require("./inventory.query")

exports.getInventory = async ({ params }) => {
  try {
    delete params.pageLimit
    delete params.pageNumber
    delete params.status
    const filerOptions = []
    if (params.model_name) {
      filerOptions.push(`${filterCondition.model_name} = '${params.model_name.trim()}'`)
    }
    if (params.variant_name) {
      filerOptions.push(`${filterCondition.variant_name} = '${params.variant_name.trim()}'`)
    }
    if (params.version_name) {
      filerOptions.push(`${filterCondition.version_name} = '${params.version_name.trim()}'`)
    }
    if (params.color) {
      filerOptions.push(`${filterCondition.color} = '${params.color.trim()}'`)
    }
    let modelFilter = ''
    if (filerOptions.length > 0) {
      modelFilter = `WHERE ${filerOptions.join(" AND ")}`
    }
    const data = await sequelize.query(queries.getInventory + modelFilter)
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: data[0],
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
}

exports.paginateData = async ({ pageLimit, pageNumber, status: deviceAssignStatus, inventoryData }) => {
  try {
    const startIndex = (pageNumber - 1) * pageLimit
    const endIndex = parseInt(startIndex) + parseInt(pageLimit)
    let paginatedData;
    if (deviceAssignStatus === "0") {
      const unassignedData = inventoryData.filter(data => data.distributor_id === "null");
      paginatedData = unassignedData.slice(startIndex, endIndex)
    }
    else if (deviceAssignStatus === "1") {
      const assignedData = inventoryData.filter(data => data.distributor_id !== "null");
      paginatedData = assignedData.slice(startIndex, endIndex)
    }
    else {
      paginatedData = inventoryData.slice(startIndex, endIndex)
    }
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: paginatedData,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: err.message,
      data: null,
    };
  }
}