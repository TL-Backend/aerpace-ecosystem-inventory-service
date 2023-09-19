const {
  assignDevices,
} = require('../controllers/distribution/distribution.controller');
const {
  validateAssignDevices,
} = require('../controllers/distribution/distribution.middleware');

module.exports = function (app) {
  app.post('/distribution/assign', validateAssignDevices, assignDevices);
};
