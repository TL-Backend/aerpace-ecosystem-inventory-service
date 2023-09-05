const {
  aergov_users,
  sequelize,
  aergov_distributions,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../../utils/logger');
const { getDataById } = require('./distribution.query');
const { statusCodes } = require('../../utils/statusCode');

exports.addDistributionHelper = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const params = {
      first_name: data.distributor_first_name,
      last_name: data.distributor_last_name,
      role_id: data.distributor_role_id,
      email: data.distributor_email,
      phone_number: data.distributor_phone_number,
      country_code: data.distributor_country_code,
      address: data.distributor_address,
      pin_code: data.distributor_pin_code,
      state: data.distributor_state,
      user_type: 'USER',
    };
    const userData = await aergov_users.create(params, { transaction });
    if (userData) {
      const DistributionParams = {
        name: data.distribution_name,
        user_id: userData.id,
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
            where: { id: userData.id },
            returning: true,
          },
          { transaction },
        );
        data.distribution_id = distributionData.id;
      }
    }
    data.distributor_id = userData.id;
    transaction.commit();
    return {
      success: true,
      errorCode: '',
      message: 'Distribution added successfully',
      data: data,
    };
  } catch (err) {
    logger.error(err);
    transaction.rollback();
    return {
      success: false,
      errorCode: statusCodes.STATUS_CODE_FAILURE,
      message: 'Error while adding distribution',
      data: null,
    };
  }
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
      errorCode: '',
      message: 'Data fetching success',
      data: data[0],
    };
  } catch (err) {
    logger.error(err);
    return {
      success: true,
      errorCode: statusCodes.STATUS_CODE_DATA_NOT_FOUND,
      message: 'Error while fetching data',
      data: null,
    };
  }
};

exports.editDistributionHelper = async (data, id) => {
  try {
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
      errorCode: '',
      message: 'Distribution details succesfully modified',
      data: data,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      errorCode: '',
      message: 'Error while modifiying distribution details',
      data: null,
    };
  }
};
