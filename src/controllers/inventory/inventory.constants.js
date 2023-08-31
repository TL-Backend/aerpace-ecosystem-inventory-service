exports.successResponses = {
  default: {
    statusCode: 200,
    message: '',
  },
  DATA_FETCH_SUCCESSFULL: {
    message: 'data fetched successful',
  },
};

exports.errorResponses = {
  default: {
    message: '',
  },
  healthCheckError: {
    message: 'Service unavailable',
  },
  PAGE_LIMIT_INVALID: {
    message: 'pageLimit is empty or invalid'
  },
  PAGE_NUMBER_INVALID: {
    message: 'pageNumber is empty or invalid'
  }
};
