const { validationResult } = require('express-validator');
const AuthService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array().map((err) => err.msg), 400);
    }

    const result = await AuthService.register(req.body);
    return successResponse(res, { token: result.token, user: result.user }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array().map((err) => err.msg), 400);
    }

    const result = await AuthService.login(req.body);
    return successResponse(res, { token: result.token, user: result.user }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
