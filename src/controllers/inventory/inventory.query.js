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
  deviceType,
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
    let deviceTypeFilter = deviceType
    ? `AND adis.name = ANY(ARRAY [:deviceType]) `
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
    ad.device_type AS device_type,
    ad.mac_number, ad.color, 
    COALESCE (json_build_object('id',ad.distribution_id, 'name',adis.name)) AS distributions
  From ${dbTables.DEVICE_TABLE} AS ad 
  JOIN ${dbTables.DEVICE_MODELS_TABLE} AS adm ON adm.id = ad.model_id
  JOIN ${dbTables.DEVICE_VERSION_TABLE} AS adve ON adve.id = ad.version_id 
  JOIN ${dbTables.DEVICE_VARIANT_TABLE} AS adva ON adva.id = ad.variant_id 
  LEFT JOIN ${dbTables.AERGOV_DISTRIBUTION} AS adis ON adis.id = ad.distribution_id
  WHERE member_id IS NULL ${versionFilter} ${colorFilter} ${distributionFilter} ${deviceTypeFilter} ${statusFilter} 
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
WITH distributions AS (
  SELECT json_agg(DISTINCT name) FILTER (WHERE name IS NOT NULL) AS names
  FROM ${dbTables.AERGOV_DISTRIBUTION}
  WHERE id IN (SELECT DISTINCT distribution_id FROM ${dbTables.DEVICES_TABLE})
),
colors AS (
  SELECT json_agg(DISTINCT color) FILTER (WHERE color IS NOT NULL) AS colors
  FROM  ${dbTables.DEVICES_TABLE}
),
device_types AS (
  SELECT json_agg(DISTINCT device_type) FILTER (WHERE device_type IS NOT NULL) AS device_types
  FROM  ${dbTables.DEVICES_TABLE}
),
devices AS (
  SELECT
      adm.id,
      adm.name,
      COALESCE( (
              SELECT json_agg(DISTINCT variants) FILTER (WHERE variants IS NOT NULL)
              FROM (
                  SELECT
                      adv.id,
                      adv.name,
                      COALESCE( (
                          SELECT json_agg(
                              json_build_object(
                                  'id', avr.id,
                                  'name', avr.name
                              )
                          ) FILTER (WHERE avr.name IS NOT NULL) AS versions
                          FROM ${dbTables.DEVICE_VERSION_TABLE} AS avr
                          WHERE avr.variant_id = adv.id
                      ), '[]') AS versions
                  FROM ${dbTables.DEVICE_VARIANT_TABLE} AS adv
                  WHERE adv.model_id = adm.id
              ) AS variants
          ), '[]') AS variants
  FROM ${dbTables.DEVICE_MODELS_TABLE} AS adm
  WHERE EXISTS (
      SELECT 1
      FROM ${dbTables.DEVICES_TABLE} AS ad
      WHERE ad.model_id = adm.id
  )
)
SELECT
  json_build_object(
      'distributions', COALESCE((SELECT names FROM distributions), '[]'),
      'colors', COALESCE((SELECT colors FROM colors), '[]'),
      'device_types', COALESCE((SELECT device_types FROM device_types), '[]'),
      'devices', COALESCE((SELECT json_agg(devices) FROM devices), '[]')
  ) AS filters;

`
