const { logger } = require('../../utils/logger');
const { HelperResponse } = require('../../utils/response');
const {
  sequelize,
  aergov_devices,
  aergov_distributions,
} = require('../../services/aerpace-ecosystem-backend-db/src/databases/postgresql/models');
const { validateDevicesToUnassign } = require('./distribution.query');
const { statusCodes } = require('../../utils/statusCodes');
const { errorResponses, successResponses } = require('./distribution.constant');

exports.unassignDevicesHelper = async (params) => {
  try {
    const { distribution_id: distributionId, devices } = params;

    const distribution = await aergov_distributions.findOne({
      where: { id: distributionId },
      raw: true,
    });

    if (!distribution) {
      return new HelperResponse({
        success: false,
        message: errorResponses.DISTRIBUTION_NOT_FOUND(distributionId),
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
      });
    }

    const isValidDevicesToUnassign = await sequelize.query(
      validateDevicesToUnassign,
      {
        replacements: { devices, distribution_id: distributionId },
        raw: true,
      },
    );

    if (!isValidDevicesToUnassign[0][0]?.result) {
      return new HelperResponse({
        success: false,
        message: errorResponses.NO_DEVICES_FOUND,
        errorCode: statusCodes.STATUS_CODE_INVALID_FORMAT,
      });
    }

    await aergov_devices.update(
      { distribution_id: null },
      {
        where: { mac_number: devices },
      },
    );

    return new HelperResponse({
      success: true,
      data: { distributionId, devices },
      message: successResponses.DEVICE_UNASSIGNED(distribution?.name),
    });
  } catch (err) {
    logger.error(err);
    return new HelperResponse({ success: false, message: err.message });
  }
};
