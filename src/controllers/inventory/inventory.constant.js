exports.successResponses = {
  default: {
    statusCode: 200,
    message: '',
  },
  DATA_FETCH_SUCCESSFULL: 'data fetched successfully',
};

exports.errorResponses = {
  default: {
    message: '',
  },
  PAGE_LIMIT_INVALID: 'pageLimit is empty or invalid',
  PAGE_NUMBER_INVALID: 'pageNumber is empty or invalid'
};

exports.filterCondition = {
  model_name: `adm.name`,
  variant_name: `adva.name`,
  version_name: `adve.name`,
  distrubution_id: `ad.distribution_id`,
  color: `ad.color`
}

exports.sortOrder = `ORDER BY ad.created_at DESC`

exports.deviceStatus = {
  ASSIGNED:'ASSIGNED',
  UNASSIGNED: 'UNASSIGNED'
}