const { dbTables } = require('../../utils/constant');

exports.validateDevicesToUnassign = `
  WITH master_devices_count AS
  (
      SELECT COUNT(*) AS master_count
      FROM ${dbTables.DEVICES_TABLE}
      WHERE mac_number = ANY(ARRAY [:devices]) AND distribution_id = :distribution_id
  )
  SELECT master_count = array_length(ARRAY [:devices], 1) AS result
  FROM master_devices_count
`;
