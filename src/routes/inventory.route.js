const {
  getImportHistoryList, importCsv, listInventory
} = require('../controllers/inventory/inventory.controller');
const {
  importCsvMiddleware,
  importCsvValidation,
} = require('../controllers/inventory/inventory.middleware');

module.exports = function (app) {
  app.get('/inventory', listInventory);
  app.get('/inventory/csv-history', getImportHistoryList);
  app.post(
    '/inventory/csv',
    importCsvMiddleware,
    importCsvValidation,
    importCsv,
  );
};