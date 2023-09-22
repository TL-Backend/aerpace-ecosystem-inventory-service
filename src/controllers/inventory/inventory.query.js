const { dbTables } = require("../../utils/constant");
const { status, activityStatus } = require("./inventory.constant");

exports.createImportHistoryEntry = `
INSERT INTO ${dbTables.DEVICES_IMPORT_HISTORY} (file_name,input_file,status,input_file_response,uploaded_by,uploaded_at)
VALUES (:file_name, :input_file, :status, :input_file_response, :uploaded_by, :uploaded_at);
`

exports.updateImportHistoryTable = `UPDATE ${dbTables.DEVICES_IMPORT_HISTORY} SET status = :status,input_file = :input_file, response_file = :response_file,uploaded_at = :uploaded_at  WHERE id = :id;`
