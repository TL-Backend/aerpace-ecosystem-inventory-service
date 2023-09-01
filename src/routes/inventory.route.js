const {
    getImportHistoryList,
} = require('../controllers/inventory/inventory.controller');

module.exports = function (app) {
    app.get('/inventory/csv-history',getImportHistoryList);
};