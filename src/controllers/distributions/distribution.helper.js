const {
  aergov_users,
  sequelize,
  aergov_distributions,
  aergov_roles,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../../utils/logger');
const {
  getDataById,
  getListDistributorsQuery,
  getFiltersQuery,
} = require('./distribution.query');
const { statusCodes } = require('../../utils/statusCode');
const { dbTables } = require('../../utils/constant');
const { postAsync } = require('../../utils/request');
const {
  defaults,
  successResponses,
  errorResponses,
  routes,
} = require('./distribution.constant');
const { url } = require('../../../config').getConfig();
const USER_SERVICE_API = url.user_service;

exports.addDistributionHelper = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const distributionRole = await aergov_roles.findOne({
      where: { role_name: defaults.DEFAULT_DISTRIBUTION_ROLE_NAME },
      raw: true,
    });

    const body = {
      first_name: data.distributor_first_name,
      last_name: data.distributor_last_name,
      role_id: data.distributor_role_id || distributionRole.id,
      email: data.distributor_email,
      phone_number: data.distributor_phone_number,
      country_code: data.distributor_country_code,
      address: data.distributor_address,
      pin_code: data.distributor_pin_code,
      state: data.distributor_state,
      user_type: defaults.USER_TYPE,
    };
    const result = await this.postAsyncUserCreation({
      api: routes.POST_USERS,
      body: body,
    });
    if (result.code === 200) {
      const DistributionParams = {
        name: data.distribution_name,
        user_id: result.data?.id,
        region: data.distribution_region,
        email: data.distribution_email,
        phone_number: data.distribution_phone_number,
        address: data.distribution_address,
        country_code: data.distribution_country_code,
      };
      const distributionData = await aergov_distributions.create(
        DistributionParams,
        { transaction },
      );
      if (distributionData) {
        await aergov_users.update(
          {
            distribution_id: distributionData.id,
          },
          {
            where: { id: result.data?.id },
            returning: true,
          },
          { transaction },
        );
        data.distribution_id = distributionData.id;
      }
    } else {
      return {
        success: false,
        errorCode: result?.code,
        message: result?.message,
        data: null,
      };
    }
    data.distributor_id = userData.id;
    transaction.commit();
    return {
      success: true,
      message: successResponses.DISTRIBUTION_ADDED_MESSAGE,
      data: data,
    };
  } catch (err) {
    logger.error(err.message);
    transaction.rollback();
    return {
      success: false,
      errorCode: err.error.code || statusCodes.STATUS_CODE_FAILURE,
      message: err.error.message || errorResponses.ERROR_FOUND,
      data: null,
    };
  }
};

exports.postAsyncUserCreation = async ({
  body,
  api,
  query,
  headers,
  prefix,
  expiryTimeInSeconds = 86400,
  json = true,
}) => {
  const data = await postAsync({
    uri: `${USER_SERVICE_API}${api}`,
    body,
    json,
    headers,
    query,
    prefix,
    expiryTimeInSeconds,
  });
  return data;
};

exports.validateDataInDBById = async (id_key, table) => {
  try {
    const query = getDataById(table);
    const data = await sequelize.query(query, {
      replacements: { id_key },
      type: sequelize.QueryTypes.SELECT,
    });
    return {
      success: true,
      message: successResponses.DATA_FETCHED,
      data: data[0],
    };
  } catch (err) {
    logger.error(err);
    return {
      success: true,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: errorResponses.ERROR_FOUND,
      data: null,
    };
  }
};

exports.editDistributionHelper = async (data, id) => {
  try {
    const distribution = await this.validateDataInDBById(
      id,
      dbTables.DISTRIBUTIONS_TABLE,
    );
    if (!distribution.data || !distribution.success) {
      return {
        success: false,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
        message: 'Invalid distribution_id',
        data: null,
      };
    }
    const DistributionParams = {
      name: data.distribution_name,
      region: data.distribution_region,
      email: data.distribution_email,
      phone_number: data.distribution_phone_number,
      address: data.distribution_address,
      country_code: data.distribution_country_code,
    };
    const distributionData = await aergov_distributions.update(
      DistributionParams,
      {
        where: { id },
        returning: true,
      },
    );
    data.distribution_id = distributionData.id;
    return {
      success: true,
      message: 'Distribution details succesfully modified',
      data: data,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: 'Error while modifiying distribution details',
      data: null,
    };
  }
};

exports.listDistributionsHelper = async (params) => {
  try {
    const query = getListDistributorsQuery(params);
    const data = await sequelize.query(query);
    let filterData,
      filterQuery,
      regions = [];

    if (params.page_number === '1' || !params.page_number) {
      filterQuery = getFiltersQuery;
      filterData = await sequelize.query(filterQuery);
      regions = filterData[0].map((row) => row.region);
    }
    let totalPages = Math.round(
      parseInt(data[0][0]?.data_count || 0) / parseInt(params.page_limit || 10),
    );
    return {
      success: true,
      data: {
        distributions: data[0],
        page_limit: parseInt(params.page_limit) || 10,
        page_number: parseInt(params.page_number) || 1,
        total_pages: totalPages !== 0 ? totalPages : 1,
        filters: regions.length
          ? {
              regions: regions,
            }
          : {},
      },
      message: successResponses.DISTRIBUTION_UPDATED_MESSAGE,
      data: data,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: 'Error while fetching distribution details',
      data: null,
    };
  }
};
