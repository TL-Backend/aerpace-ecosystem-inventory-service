'use strict';

require('dotenv').config();
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const app = express();

const { errorResponse } = require('./src/utils/responseHandler');
const { statusCodes } = require('./src/utils/statusCode');
const { router } = require('./src/routes/index');
app.disable('x-powered-by');

const environment = process.env.NODE_ENV || 'development';
const envFilePath = `config/${environment}.env`;
require('dotenv').config({ path: envFilePath });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', router);

app.use(
  cors({
    origin: 'trustedwebsite.com', //TODO:After the development is finished, add the origin.
  }),
);

app.use((req, res, next) =>
  errorResponse({
    code: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
    req,
    res,
    message: 'Route not found',
  }),
);

app.use((error, req, res, next) =>
  errorResponse({
    code: statusCodes.STATUS_CODE_FAILURE,
    req,
    res,
    error,
    message: error.message,
  }),
);

app.listen(process.env.PORT || 3002, () => {
  console.log(`server started running on port ${process.env.PORT}`);
});
