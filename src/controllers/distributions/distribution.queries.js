exports.getDataById = (table) => {
  return `SELECT *
    FROM ${table}
    WHERE id = :id_key
    `;
};
