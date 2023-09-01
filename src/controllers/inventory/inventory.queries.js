const {dbTables, defaultValues} = require('../../utils/constants');
exports.getInventoryImportHistoryQuery = (pageLimit, pageNumber) => {
    let queryPagination = ' ';
    queryPagination = `OFFSET((${parseInt(pageNumber || defaultValues.DEFAULT_PAGE_NUMBER)}-1)*${parseInt(
        pageLimit || defaultValues.DEFAULT_PAGE_LIMIT,
    )}) ROWS FETCH NEXT ${parseInt(pageLimit || defaultValues.DEFAULT_PAGE_LIMIT)} ROWS ONLY`;
    return `select * from ${dbTables.IMPORT_HISTORY_TABLE} ${queryPagination}`;
}