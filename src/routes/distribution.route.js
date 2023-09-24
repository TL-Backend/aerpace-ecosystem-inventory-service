const {
  unassignDevices,
  addDistribution,
  listDistributions,
  editDistribution,
} = require('../controllers/distribution/distribution.controller');
const {
  validateUnassignDevices,
  validateDistributionInput,
  validateEditDistributionInput,
  validateListDistributionInput,
} = require('../controllers/distribution/distribution.middleware');

module.exports = function (app) {
  app.post('/distribution/unassign', validateUnassignDevices, unassignDevices);
  app.post('/distributions', validateDistributionInput, addDistribution);
  app.get('/distributions', validateListDistributionInput, listDistributions);
  app.patch(
    '/distributions/:id',
    validateEditDistributionInput,
    editDistribution,
  );
};
