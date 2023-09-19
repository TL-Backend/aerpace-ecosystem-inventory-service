const router = require('express').Router();

require('./sample.route')(router);
require('./distribution.route')(router);

module.exports = {
  router,
};
