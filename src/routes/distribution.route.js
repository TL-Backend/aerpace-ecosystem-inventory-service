const {
  addDistribution,
  listDistributions,
} = require('../controllers/distributions/distribution.controller');
const {
  validateDistributionInput,
  validateListDistributionInput,
} = require('../controllers/distributions/distribution.middleware');

module.exports = function (app) {
  app.post('/distributions', validateDistributionInput, addDistribution);
  app.get('/distributions', validateListDistributionInput, listDistributions);
};
