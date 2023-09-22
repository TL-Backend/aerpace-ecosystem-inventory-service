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
exports.updateImportHistoryTable = `UPDATE ${dbTables.DEVICES_IMPORT_HISTORY} SET status = :status,input_file = :input_file, response_file = :response_file,uploaded_at = :uploaded_at  WHERE id = :id;`
