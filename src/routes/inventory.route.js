const { listInventory } = require('../controllers/inventory/inventory.controller');
const { listInventoryValidations } = require('../controllers/inventory/inventory.middleware');

module.exports = function (app) {
  app.get('/inventory', listInventoryValidations, listInventory);
};
