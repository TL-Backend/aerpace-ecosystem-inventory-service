const {
  assignDevices,
  unassignDevices,
  addDistribution,
  listDistributions,
  editDistribution,
} = require('../controllers/distribution/distribution.controller');
const {
  validateInputToAssignOrUnassignDevices,
  validateUnassignDevices,
  validateDistributionInput,
  validateEditDistributionInput,
  validateListDistributionInput,
} = require('../controllers/distribution/distribution.middleware');

module.exports = function (app) {
  app.post('/distribution/assign', validateInputToAssignOrUnassignDevices, assignDevices);
  app.post('/distribution/unassign', validateInputToAssignOrUnassignDevices, unassignDevices);
  app.post('/distribution', validateDistributionInput, addDistribution);
  app.get('/distribution', validateListDistributionInput, listDistributions);
  app.patch(
    '/distribution/:id',
    validateEditDistributionInput,
    editDistribution,
  );
};
