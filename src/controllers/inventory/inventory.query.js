const { dbTables } = require('../../utils/constant');
const {
  getPaginationQuery,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/common.query');

exports.getInventory = ({
  versionId,
  color,
  status,
  distribution,
  distributionId,
  search,
  pageLimit,
  pageNumber,
}) => {
  const statuses = {
    ASSIGNED: ({ distributionId }) => {
      const distributionCondition = distributionId
        ? ` = '${distributionId}' `
        : `IS NOT NULL`;
      return ` AND ad.distribution_id ${distributionCondition} `;
    },
    UNASSIGNED: ({ distributionId }) => {
      return ` AND ad.distribution_id IS NULL `;
    },
  };

  let versionFilter = versionId
    ? `AND ad.version_id = ANY(ARRAY [:versions]) `
    : ' ';
  let colorFilter = color ? `AND ad.color = ANY(ARRAY [:colors]) ` : ' ';
  let distributionFilter = distribution
    ? `AND adis.name = ANY(ARRAY [:distributions]) `
    : ' ';
  let statusFilter = status ? statuses[status]({ distributionId }) : ' ';
  let querySearchCondition = search
    ? ` AND ( 
    ad.mac_number ILIKE :search 
    OR adm.name ILIKE :search 
    OR adve.name ILIKE :search 
    OR adva.name ILIKE :search 
    OR ad.color ILIKE :search 
    OR adis.name ILIKE :search
    )`
    : ' ';

  const paginationQuery = getPaginationQuery({ pageLimit, pageNumber });

  return `
  SELECT 
    COUNT(*) OVER() AS data_count,
    adm.name AS model_name,
    adve.name AS version_name,
    adva.name AS variant_name, 
    ad.mac_number, ad.color, 
    COALESCE (json_build_object('id',ad.distribution_id, 'name',adis.name)) AS distributions
  From ${dbTables.DEVICE_TABLE} AS ad 
  JOIN ${dbTables.DEVICE_MODELS_TABLE} AS adm ON adm.id = ad.model_id
  JOIN ${dbTables.DEVICE_VERSION_TABLE} AS adve ON adve.id = ad.version_id 
  JOIN ${dbTables.DEVICE_VARIANT_TABLE} AS adva ON adva.id = ad.variant_id 
  LEFT JOIN ${dbTables.AERGOV_DISTRIBUTION} AS adis ON adis.id = ad.distribution_id
  WHERE member_id IS NULL ${versionFilter} ${colorFilter} ${distributionFilter} ${statusFilter} 
    ${querySearchCondition}
  ${paginationQuery}
  `;
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

exports.filterInventoryQuery = `
  SELECT
  json_build_object(
      'distributions', COALESCE(
          json_agg(DISTINCT adis.name),
          '[]'
      ),
      'colors', COALESCE(
          json_agg(DISTINCT ad.color),
          '[]'
      ),
      'device_types', COALESCE(
          json_agg(DISTINCT ad.device_type),
          '[]'
      ),
      'devices', COALESCE(
          (
              SELECT json_agg(DISTINCT devices)
              FROM (
                  SELECT
                      adm.id,
                      adm.name,
                      COALESCE(
                          (
                              SELECT json_agg(DISTINCT variants)
                              FROM (
                                  SELECT
                                      adv.id,
                                      adv.name,
                                      COALESCE(
                                          (
                                              SELECT json_agg(DISTINCT versions)
                                              FROM (
                                                  SELECT
                                                      avr.id,
                                                      avr.name
                                                  FROM ${dbTables.DEVICE_VERSION_TABLE} AS avr
                                                  WHERE avr.variant_id = adv.id
                                              ) AS versions
                                          ),
                                          '[]'
                                      ) AS versions
                                  FROM ${dbTables.DEVICE_VARIANT_TABLE} AS adv
                                  WHERE adv.model_id = adm.id
                              ) AS variants
                          ),
                          '[]'
                      ) AS variants
                  FROM ${dbTables.DEVICE_MODELS_TABLE} AS adm
                  WHERE EXISTS (
                      SELECT 1
                      FROM aergov_devices AS ad
                      WHERE ad.model_id = adm.id
                  )
              ) AS devices
          ),
          '[]'
      )
  ) AS filters
  FROM ${dbTables.DEVICES_TABLE} AS ad
  LEFT JOIN ${dbTables.AERGOV_DISTRIBUTION} AS adis ON adis.id = ad.distribution_id
  WHERE ad.distribution_id IS NOT NULL;

`
