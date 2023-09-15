const { importCsv } = require("../controllers/inventory/inventory.controller");
const { importCsvMiddleware, importCsvValidation } = require("../controllers/inventory/inventory.middleware");

module.exports = function (app) {
  app.post('/inventory/csv', importCsvMiddleware, importCsvValidation, importCsv)
};