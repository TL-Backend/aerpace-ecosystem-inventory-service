const router = require('express').Router();

require('./sample.route')(router);
require('./distributions.route')(router);

module.exports = {
  router,
};
