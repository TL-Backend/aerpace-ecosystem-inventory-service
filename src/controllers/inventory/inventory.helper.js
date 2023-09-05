const { sequelize } = require("../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models")
const { logger } = require("../../utils/logger")
const { statusCodes } = require("../../utils/statusCode")
const { filterCondition, successResponses, deviceStatus } = require("./inventory.constant")
const { queries } = require("./inventory.query")

exports.getInventory = async ({ params, paginationQuery }) => {
  try {
    delete params.pageLimit
    delete params.pageNumber
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
    if (params.device_assign_status && params.device_assign_status.toLowerCase().trim() === deviceStatus.ASSIGNED){
      filerOptions.push(`${filterCondition.distrubution_id} is NOT NULL`)
    }
    if (params.device_assign_status && params.device_assign_status.toLowerCase().trim() === deviceStatus.UNASSIGNED){
      filerOptions.push(`${filterCondition.distrubution_id} is NULL`)
    }
    let modelFilter = ''
    if (filerOptions.length > 0) {
      modelFilter = `WHERE ${filerOptions.join(" AND ")}`
    }
    const data = await sequelize.query(`${queries.getInventory} ${modelFilter} ${paginationQuery}`)
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
