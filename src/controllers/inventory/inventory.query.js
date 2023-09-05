const { dbTables } = require("../../utils/constant");

exports.queries = {
  getInventory: `SELECT ad.name, adm.name AS model_name, adve.name AS version_name, adva.name AS variant_name, ad.mac_number, ad.color, ad.distributor_id From ${dbTables.DEVICE_TABLE} AS ad JOIN ${dbTables.DEVICE_MODELS_TABLE}
   AS adm ON adm.id = ad.model_id JOIN ${dbTables.DEVICE_VERSION_TABLE} AS adve ON adve.id = ad.version_id JOIN ${dbTables.DEVICE_VARIANT_TABLE} AS adva ON adva.id = ad.variant_id `,
};
