const {
  sequelize,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { HelperResponse } = require('../../utils/response');
const { getImportHistoryQuery } = require('./inventory.query');
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
