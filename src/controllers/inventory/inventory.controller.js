const {logger} = require("../../utils/logger");
const {errorResponse, successResponse} = require("../../utils/responseHandler");
const {statusCodes} = require("../../utils/statusCode");
const messages = require("./inventory.constant");
const {getInventoryImportHistory} = require("./inventory.helper");
exports.getImportHistoryList = async (request, response) => {
    try {
        let importHistory = await getInventoryImportHistory(request);

        return successResponse({
            data: importHistory.data,
            req: request,
            res: response,
            message: messages.successMessages.CSV_IMPORT_HISTORY_FETCHED_MESSAGE,
            code: statusCodes.STATUS_CODE_SUCCESS,
        });

    } catch (error) {
        logger.error(error);
        return errorResponse({
            req: request,
            res: response,
            code: statusCodes.STATUS_CODE_FAILURE,
        });
    }
}