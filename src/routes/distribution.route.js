const {
  addDistribution,
  listDistributions,
  editDistribution,
} = require('../controllers/distributions/distribution.controller');

const {
  validateDistributionInput,
  validateEditDistributionInput,
  validateListDistributionInput,
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
