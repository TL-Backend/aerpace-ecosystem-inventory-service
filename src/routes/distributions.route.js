const { addDistribution } = require("../controllers/distributions/distributions.controller");
const { validateDistributionInput } = require("../controllers/distributions/distributions.middleware");


module.exports = function (app) {
  app.post('/distributions',validateDistributionInput, addDistribution);
};