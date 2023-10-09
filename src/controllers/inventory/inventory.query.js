const { dbTables } = require('../../utils/constant');
const {
  getPaginationQuery,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/common.query');

exports.queries = {
  getInventory: `
  SELECT 
    COUNT(*) OVER() AS data_count,
    ad.name, adm.name AS model_name,
    adve.name AS version_name,
    adva.name AS variant_name, 
    ad.mac_number, ad.color, 
    COALESCE (json_build_object('id',ad.distribution_id, 'name',adis.name)) AS distributions
  From ${dbTables.DEVICE_TABLE} AS ad 
  JOIN ${dbTables.DEVICE_MODELS_TABLE} AS adm ON adm.id = ad.model_id
  JOIN ${dbTables.DEVICE_VERSION_TABLE} AS adve ON adve.id = ad.version_id 
  JOIN ${dbTables.DEVICE_VARIANT_TABLE} AS adva ON adva.id = ad.variant_id 
  LEFT JOIN ${dbTables.AERGOV_DISTRIBUTION} AS adis ON adis.id = ad.distribution_id
  WHERE member_id IS NULL
  `,
};

exports.getImportHistoryQuery = ({ pageLimit = 10, pageNumber = 1 }) => {
  return `
    SELECT
      (SELECT COUNT(*) FROM ${dbTables.IMPORT_HISTORY_TABLE}) AS total_count,
      (
        SELECT COALESCE(json_agg(import_histories), '[]' :: json)
        FROM (
          SELECT adih.id, file_name, input_file, 
          response_file, CONCAT(au.first_name, ' ', au.last_name) AS uploaded_by, 
          uploaded_at, status 
          FROM ${dbTables.IMPORT_HISTORY_TABLE} as adih
          LEFT JOIN ${dbTables.USERS_TABLE} as au on au.id = adih.uploaded_by
          ORDER BY uploaded_at DESC
          ${getPaginationQuery({ pageLimit, pageNumber })}
        ) AS import_histories
      ) AS import_histories, ${pageLimit} as page_limit, ${pageNumber} as page_number
`;
};
