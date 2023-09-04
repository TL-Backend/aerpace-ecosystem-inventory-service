const { dbTables } = require('../../utils/constants');

exports.getListDistributorsQuery = (params) => {
    const { page_number, page_size, search, region } = params;
    let searchCondition = ``;
    let userSearchCondition = '';
    let queryFilterCondition = ``;

    if(search) {
      searchCondition = `dst.name ILIKE '%${search}%' OR  dst.region ILIKE '%${search}%' OR dst.email ILIKE '%${search}%'`;
      userSearchCondition = `usr.first_name ILIKE '%${search}%' OR last_name ILIKE '%${search}%'`
    }

    if(region) {
      let filterData = region.split(',');
      filterData.forEach(data => {
        i
        queryFilterCondition = (queryFilterCondition === '')? region = '${data}': queryFilterCondition + `AND region = '${data}'`
      });
    }

    let paginationCondition = `OFFSET(((${parseInt(page_number || 1)})-1)*${parseInt(page_size || 10)}) ROWS FETCH NEXT ${parseInt(page_size || 10)} ROWS ONLY`
    let query = `
    select 
    COUNT(*) OVER() AS data_count,
    dst.*,
    usr.first_name as firsr_name,
    usr.last_name as last_name
    FROM ${dbTables.DISTRIBUTIONS_TABLE} as dst
    left JOIN ${dbTables.USERS_TABLE} as usr on usr.id = dst.user_id
    WHERE alrt.tenant_id = $1 
    ${queryFilterCondition}
    ${userSearchCondition}
    ${searchCondition}
    ${paginationCondition}
    `;

    return query;
}