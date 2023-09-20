const { dbTables } = require('../../utils/constant');
const {
  getPaginationQuery,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/common.query');

exports.getImportHistoryQuery = ({ pageLimit = 10, pageNumber = 1 }) => {
  return `
    SELECT
      (SELECT COUNT(*) FROM ${dbTables.IMPORT_HISTORY_TABLE}) AS total_count,
      (
        SELECT COALESCE(json_agg(import_histories), '[]' :: json)
        FROM (
          SELECT *
          FROM ${dbTables.IMPORT_HISTORY_TABLE}
          ORDER BY uploaded_at DESC
          ${getPaginationQuery({ pageLimit, pageNumber })}
        ) AS import_histories
      ) AS import_histories, ${pageLimit} as page_limit, ${pageNumber} as page_number
`;
};
