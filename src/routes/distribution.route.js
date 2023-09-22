const {
  assignDevices,
  addDistribution,
  listDistributions,
  editDistribution,
} = require('../controllers/distribution/distribution.controller');
const {
  validateAssignDevices,
  validateDistributionInput,
  validateEditDistributionInput,
  validateListDistributionInput,
} = require('../controllers/distribution/distribution.middleware');

module.exports = function (app) {
  app.post('/distribution/assign', validateAssignDevices, assignDevices);
  app.post('/distributions', validateDistributionInput, addDistribution);
  app.get('/distributions', validateListDistributionInput, listDistributions);
  app.patch(
    '/distributions/:id',
    validateEditDistributionInput,
    editDistribution,
  );
};
