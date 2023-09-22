const {
  addDistribution,
  listDistributions,
  editDistribution,
} = require('../controllers/distribution/distribution.controller');

const {
  validateDistributionInput,
  validateEditDistributionInput,
  validateListDistributionInput,
} = require('../controllers/distribution/distribution.middleware');

module.exports = function (app) {
  app.post('/distributions', validateDistributionInput, addDistribution);
  app.get('/distributions', validateListDistributionInput, listDistributions);
  app.patch(
    '/distributions/:id',
    validateEditDistributionInput,
    editDistribution,
  );
};
