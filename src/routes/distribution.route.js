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
  app.post('/distribution', validateDistributionInput, addDistribution);
  app.get('/distribution', validateListDistributionInput, listDistributions);
  app.patch(
    '/distribution/:id',
    validateEditDistributionInput,
    editDistribution,
  );
};
