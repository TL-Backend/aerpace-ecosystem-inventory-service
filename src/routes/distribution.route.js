const {
  addDistribution,
  editDistribution,
} = require('../controllers/distributions/distribution.controller');
const {
  validateDistributionInput,
  validateEditDistributionInput,
} = require('../controllers/distributions/distribution.middleware');

module.exports = function (app) {
  app.post('/distributions', validateDistributionInput, addDistribution);
  app.patch(
    '/distributions/:id',
    validateEditDistributionInput,
    editDistribution,
  );
};
