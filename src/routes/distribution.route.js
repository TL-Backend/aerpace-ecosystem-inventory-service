const {
  addDistribution,
  listDistributions,
} = require('../controllers/distributions/distribution.controller');
const {
  validateDistributionInput,
  validateListDistributionInput,
  editDistribution,
} = require('../controllers/distributions/distribution.controller');
const {
  validateDistributionInput,
  validateEditDistributionInput,
} = require('../controllers/distributions/distribution.middleware');

module.exports = function (app) {
  app.post('/distributions', validateDistributionInput, addDistribution);
  app.get('/distributions', validateListDistributionInput, listDistributions);
  app.patch(
    '/distributions/:id',
    validateEditDistributionInput,
    editDistribution,
  );
};
