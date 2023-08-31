const { listInventory } = require('../controllers/inventory/inventory.controller');
const { listInventoryValidation } = require('../controllers/inventory/inventory.middleware');

module.exports = function (app) {
  app.get('/inventory', listInventoryValidation, listInventory);
};
