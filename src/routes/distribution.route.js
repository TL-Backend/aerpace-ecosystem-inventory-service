const {
  addDistribution,
} = require('../controllers/distributions/distribution.controller');
const {
  validateDistributionInput,
} = require('../controllers/distributions/distribution.middleware');

module.exports = function (app) {
  app.post('/distributions', validateDistributionInput, addDistribution);
};
