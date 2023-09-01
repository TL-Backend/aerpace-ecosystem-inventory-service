const {
  aergov_users,
  sequelize,
  aergov_distributions,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { logger } = require('../../utils/logger');

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
        country_code: data.distribution_country_code
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
      data: data
    };
  } catch (err) {
    logger.error(err);
    transaction.rollback();
    return {
      data: err,
      success: false,
    };
  }
};
