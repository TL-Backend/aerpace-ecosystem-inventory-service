const router = require('express').Router();

require('./sample.route')(router);
require('./inventory.route')(router);

module.exports = {
  router,
};
