const { validationResult } = require('express-validator');
const ProfileService = require('../services/profileService');
const { successResponse, errorResponse } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const profile = await ProfileService.getProfile(req.user.id);
    return successResponse(res, profile, 'Profile loaded');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array().map((err) => err.msg), 400);
    }
    const updated = await ProfileService.updateProfile(req.user.id, req.body);
    return successResponse(res, updated, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array().map((err) => err.msg), 400);
    }
    await ProfileService.changePassword(req.user.id, req.body);
    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
