const {dbTables} = require('../../utils/constant');
const {getPaginationQuery} = require("../../services/aerpace-ecosystem-backend-db/src/commons/common.query");
exports.getInventoryImportHistoryQuery = (pageLimit, pageNumber) => {
    return `select * from ${dbTables.IMPORT_HISTORY_TABLE} ${getPaginationQuery(pageLimit, pageNumber)}`;
}