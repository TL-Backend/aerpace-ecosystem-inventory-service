const { addDistribution, editDistribution } = require("../controllers/distributions/distributions.controller");
const { validateDistributionInput, validateEditDistributionInput } = require("../controllers/distributions/distributions.middleware");


module.exports = function (app) {
  app.post('/distributions',validateDistributionInput, addDistribution);
  app.patch('/distributions/:id',validateEditDistributionInput, editDistribution);
};