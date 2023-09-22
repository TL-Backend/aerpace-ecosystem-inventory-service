const { sequelize } = require("../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models")
const { logger } = require("../../utils/logger")
const { statusCodes } = require("../../utils/statusCode")
const { filterCondition, successResponses, deviceStatus, sortOrder } = require("./inventory.constant")
const { queries } = require("./inventory.query")
const { HelperResponse } = require('../../utils/response');
const { getImportHistoryQuery } = require('./inventory.query');

exports.getInventory = async ({ params, paginationQuery }) => {
  try {
    const pageLimit = params.page_limit
    const pageNumber = params.page_number
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
    if (params.status && params.status.trim() === deviceStatus.ASSIGNED) {
      filerOptions.push(`${filterCondition.distrubution_id} is NOT NULL`)
    }
    if (params.status && params.status.trim() === deviceStatus.UNASSIGNED) {
      filerOptions.push(`${filterCondition.distrubution_id} is NULL`)
    }
    let modelFilter = ''
    if (filerOptions.length > 0) {
      modelFilter = `WHERE ${filerOptions.join(" AND ")}`
    }
    const inventoryData = await sequelize.query(`${queries.getInventory} ${modelFilter} ${sortOrder} ${paginationQuery}`)
    let totalPages = Math.round(
      parseInt(inventoryData[0][0]?.data_count || 0) / parseInt(pageLimit || 10),
    );
    const data = {
      devices: inventoryData[0],
      total_count: inventoryData[0][0] ? parseInt(inventoryData[0][0].data_count) : 0,
      page_limit: parseInt(pageLimit) || 10,
      page_number: parseInt(pageNumber) || 1,
      total_pages: totalPages !== 0 ? totalPages : 1,
    }
    return {
      success: true,
      message: successResponses.DATA_FETCH_SUCCESSFULL,
      data: data,
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

exports.getInventoryImportHistory = async (params) => {
  try {
    const importHistory = await sequelize.query(
      getImportHistoryQuery(
        {
          pageLimit: parseInt(params.query.page_limit),
          pageNumber: parseInt(params.query.page_number),
        },
        {
          type: sequelize.QueryTypes.SELECT,
        },
      ),
    );

    let totalPages;

    totalPages = Math.round(
      parseInt(importHistory[0][0]?.total_count) /
        parseInt(importHistory[0][0]?.page_limit),
    );

    return new HelperResponse({
      success: true,
      data: {
        import_history: importHistory[0][0]?.import_histories,
        total_count: importHistory[0][0]?.total_count,
        page_limit: importHistory[0][0]?.page_limit,
        page_number: importHistory[0][0]?.page_number,
        total_pages: totalPages,
      },
    });
  } catch (err) {
    return new HelperResponse({ success: false, message: err.message });
  }
};
