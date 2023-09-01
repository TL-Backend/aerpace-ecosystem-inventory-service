
exports.errorMessages = {
  INVAILD_STRING_OR_MISSING_ERROR: (value) => {
    return `${value} should be present and it must be an string`;
  },
  INVAILD_EMAIL_FORMAT_MESSAGE: 'Invalid email format',
  INVAILD_SEARCH_KEY: 'Invalid search key, it should be string!',
  PAGE_LIMIT_MESSAGE: 'Page limit should be positive',
  PAGE_NUMBER_MESSAGE: 'Page number should be positive',
};


exports.successMessages = {
  DISTRIBUTION_ADDED_MESSAGE: 'Distribution created successfully',
  DISTRIBUTION_UPDATED_MESSAGE: 'Distribution updated successfully',
  DISTRIBUTIONS_FETCHED_MESSAGE: 'Distributions fetched successfully',
};
