const {
    sequelize,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const {getInventoryImportHistoryQuery} = require("./inventory.queries");
exports.getInventoryImportHistory = async (request) => {
    try {
        const importHistory = await sequelize.query(getInventoryImportHistoryQuery(parseInt(request.query.pageLimit), parseInt(request.query.pageNumber)));
        return {
            success: true, data: {"import_history": importHistory[0]},
        };
    } catch (error) {
        return {
            success: false, data: error,
        };
    }
}