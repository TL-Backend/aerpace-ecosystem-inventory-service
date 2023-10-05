const { dbTables } = require('../../utils/constant');
const {
  getPaginationQuery,
} = require('../../services/aerpace-ecosystem-backend-db/src/commons/common.query');

exports.validateDevicesToAssign = `
  WITH input_ids AS (
    SELECT unnest(ARRAY[:devices]) AS mac_number
  )
  SELECT 
    ARRAY(
      SELECT mac_number
      FROM input_ids
      WHERE mac_number IN (SELECT mac_number FROM ${dbTables.DEVICES_TABLE} WHERE distribution_id IS NULL)
    ) AS success_ids,
    ARRAY(
      SELECT mac_number
      FROM input_ids
      WHERE mac_number NOT IN (SELECT mac_number FROM ${dbTables.DEVICES_TABLE} WHERE distribution_id IS NULL)
    ) AS failed_ids;
`;

exports.validateDevicesToUnassign = `
  WITH input_ids AS (
    SELECT unnest(ARRAY[:devices]) AS mac_number
  )
  SELECT 
    ARRAY(
      SELECT mac_number
      FROM input_ids
      WHERE mac_number IN (SELECT mac_number FROM ${dbTables.DEVICES_TABLE} WHERE distribution_id = :distribution_id)
    ) AS success_ids,
    ARRAY(
      SELECT mac_number
      FROM input_ids
      WHERE mac_number NOT IN (SELECT mac_number FROM ${dbTables.DEVICES_TABLE}) 
      OR (mac_number IN (SELECT mac_number FROM ${dbTables.DEVICES_TABLE} WHERE distribution_id IS NULL))
      OR (mac_number IN (SELECT mac_number FROM ${dbTables.DEVICES_TABLE} WHERE distribution_id <> :distribution_id))
    ) AS failed_ids;
  `;

exports.getListDistributorsQuery = (params) => {
  const { page_number, page_limit, search, region } = params;
  let searchCondition = '';
  let queryFilterCondition = '';
  let paginationCondition = '';

  if (search) {
    searchCondition = `AND dst.name ILIKE '%${search}%' OR dst.region ILIKE '%${search}%' OR dst.email ILIKE '%${search}%' OR usr.first_name ILIKE '%${search}%' OR usr.last_name ILIKE '%${search}%'`;
    if (!region)
      searchCondition =
        'WHERE ' +
        `dst.name ILIKE '%${search}%' OR dst.region ILIKE '%${search}%' OR dst.email ILIKE '%${search}%' OR usr.first_name ILIKE '%${search}%' OR usr.last_name ILIKE '%${search}%'`;
  }

  if (region) {
    let filterData = region.split(',');
    filterData.forEach((data) => {
      data = data.trim();
      queryFilterCondition =
        queryFilterCondition === ''
          ? `WHERE region = '${data}'`
          : queryFilterCondition + ` OR region = '${data}'`;
    });
  }
  paginationCondition = getPaginationQuery({
    pageLimit: page_limit,
    pageNumber: page_number,
  });
  let query = `
    SELECT 
      COUNT(*) OVER() AS data_count,
      dst.id, dst.name,dst.email, dst.address, dst.region, dst.phone_number,
      json_build_object('first_name', usr.first_name, 'last_name', usr.last_name, 'address', usr.address, 'state', usr.state, 'pincode', usr.pin_code, 'phone_number', usr.phone_number) as distributor
    FROM ${dbTables.DISTRIBUTIONS_TABLE} as dst
    LEFT JOIN ${dbTables.USERS_TABLE} as usr on usr.id = dst.user_id
    ${queryFilterCondition}
    ${searchCondition}
    GROUP BY dst.name, dst.id, dst.email, dst.address, dst.region, dst.phone_number, usr.first_name, usr.last_name, usr.address, usr.state, usr.pin_code, usr.phone_number
    ORDER BY dst.created_at DESC
    ${paginationCondition}
  `;
  return query;
};

exports.getFiltersQuery = `SELECT DISTINCT region FROM ${dbTables.DISTRIBUTIONS_TABLE}`;

exports.getDataById = (table) => {
  return `SELECT *
    FROM ${table}
    WHERE id = :id_key
    `;
};

exports.getDistributionByEmailQuery = `SELECT *
FROM ${dbTables.DISTRIBUTIONS_TABLE}
WHERE email = :email
`;
