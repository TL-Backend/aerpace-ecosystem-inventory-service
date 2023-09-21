const { listInventory } = require('../controllers/inventory/inventory.controller');
const {
  getImportHistoryList,
} = require('../controllers/inventory/inventory.controller');

module.exports = function (app) {
  app.get('/inventory', listInventory);
  app.get('/inventory/csv-history', getImportHistoryList);
};


