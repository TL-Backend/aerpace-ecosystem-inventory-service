const { sequelize } = require("../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models")
const { queries } = require("./inventory.query")

exports.getInventory = async (params) => {
  delete params.pageLimit
  delete params.pageNumber
  delete params.status
  let filterOption = '';
  for (const item in params) {
    if (params[item]) {
      const condition = (filterOption == '') ? `WHERE ${item.trim()} = '${params[item].trim()}'` : ` AND ${item.trim()} = '${params[item].trim()}'`;
      filterOption = filterOption + condition
    }
  }
  const data = await sequelize.query(queries.getinventory + filterOption)
  return {
    success: true,
    data: data[0],
  };
}