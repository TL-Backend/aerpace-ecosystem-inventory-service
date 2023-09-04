exports.successResponses = {
  default: {
    statusCode: 200,
    message: '',
  },
  DATA_FETCH_SUCCESSFULL: 'data fetched successful',
};

exports.errorResponses = {
  default: {
    message: '',
  },
  healthCheckError: 'Service unavailable',
  PAGE_LIMIT_INVALID: 'pageLimit is empty or invalid',
  PAGE_NUMBER_INVALID:'pageNumber is empty or invalid'
};
 exports.filterCondition = {
  model_name : `adm.name`,
  variant_name : `adva.name`,
  version_name : `adve.name`,
  color: `ad.color`
 }