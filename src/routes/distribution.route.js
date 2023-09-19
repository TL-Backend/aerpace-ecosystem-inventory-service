const {
  unassignDevices,
} = require('../controllers/distribution/distribution.controller');
const {
  validateUnassignDevices,
} = require('../controllers/distribution/distribution.middleware');

module.exports = function (app) {
  app.post('/distribution/unassign', validateUnassignDevices, unassignDevices);
};
