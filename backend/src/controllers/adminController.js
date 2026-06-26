const { successResponse } = require('../utils/response');
const adminService = require('../services/adminService');

const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getStats();
    return successResponse(res, stats, 'Admin statistics loaded');
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
