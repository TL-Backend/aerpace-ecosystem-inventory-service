const { dbTables } = require("../../utils/constant");
const { status, activityStatus } = require("./inventory.constant");

exports.createImportHistoryEntry = `
INSERT INTO ${dbTables.DEVICES_IMPORT_HISTORY} (file_name,input_file,status,input_file_response,uploaded_by,uploaded_at)
VALUES (:file_name, :input_file, :status, :input_file_response, :uploaded_by, :uploaded_at);
`
exports.getVersionDetails = `
SELECT * FROM ${dbTables.DEVICE_VERSION_TABLE} WHERE id = :version_id AND status = '${activityStatus.ACTIVE}'
`

exports.getDevicesWithMacAddress = `
SELECT EXISTS (SELECT * FROM ${dbTables.DEVICES_TABLE} WHERE mac_number = :mac_number)
`
exports.uppdateImportHistoryTable = `UPDATE ${dbTables.DEVICES_IMPORT_HISTORY} SET status = :status WHERE id = :id;`

// exports.getVersionForCondt = `
// SELECT *
// FROM aergov_device_versions
// WHERE id = :version_id
//   AND status = ${activityStatus.ACTIVE}
//   AND EXISTS (
//     SELECT 1
//     FROM aergov_devices
//     WHERE mac_number = :mac_number
//   );
// `