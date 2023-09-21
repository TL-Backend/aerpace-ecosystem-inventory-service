const { listInventory } = require('../controllers/inventory/inventory.controller');

module.exports = function (app) {
  app.get('/inventory', listInventory);
};
