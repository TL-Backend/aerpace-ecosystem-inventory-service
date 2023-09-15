const {
  aergov_users,
  sequelize,
  aergov_distributions,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../../utils/logger');
const { statusCodes } = require('../../utils/statusCode');
const {
  getListDistributorsQuery,
  getFiltersQuery,
} = require('./distribution.query');
const { getDataById } = require('./distribution.query');
const { statusCodes } = require('../../utils/statusCode');
const { dbTables } = require('../../utils/constant');
const { postAsync } = require('../../utils/request');
const { url } = require('../../../config').getConfig();
const USER_SERVICE_API = url.user_service;

exports.addDistributionHelper = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const body = {
      first_name: data.distributor_first_name,
      last_name: data.distributor_last_name,
      role_id: data.distributor_role_id || 'r_1',
      email: data.distributor_email,
      phone_number: data.distributor_phone_number,
      country_code: data.distributor_country_code,
      address: data.distributor_address,
      pin_code: data.distributor_pin_code,
      state: data.distributor_state,
      user_type: 'USER',
    };
    const result = await this.postAsyncUserCreation({
      api: 'api/v1/users',
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
      message: 'Distribution added successfully',
      data: data,
    };
  } catch (err) {
    logger.error(err.error.code);
    transaction.rollback();
    return {
      success: false,
      errorCode: err.error.code || statusCodes.STATUS_CODE_FAILURE,
      message: err.error.message || 'Error while adding distribution',
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
