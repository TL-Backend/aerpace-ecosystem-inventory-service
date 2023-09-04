const db = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { dbTables } = require('../../utils/constants');

exports.getListDistributorsQuery = (params) => {
  const { page_number, page_limit, search, region } = params;
  let searchCondition = ``;
  let queryFilterCondition = ``;

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
      queryFilterCondition =
        queryFilterCondition === ''
          ? `WHERE region = '${data}'`
          : queryFilterCondition + ` OR region = '${data}'`;
    });
  }

  let paginationCondition = `OFFSET(((${parseInt(page_number || 1)})-1)*${
    parseInt(page_limit) || 10
  }) ROWS FETCH NEXT ${parseInt(page_limit) || 10} ROWS ONLY`;
  let query = `
    SELECT 
      COUNT(*) OVER() AS data_count,
      dst.*,
      usr.first_name as first_name,
      usr.last_name as last_name
    FROM ${dbTables.DISTRIBUTIONS_TABLE} as dst
    LEFT JOIN ${dbTables.USERS_TABLE} as usr on usr.id = dst.user_id
    ${queryFilterCondition}
    ${searchCondition}
    ${paginationCondition}
  `;
  return query;
};

exports.getFiltersQuery = `SELECT DISTINCT region FROM ${dbTables.DISTRIBUTIONS_TABLE}`;
