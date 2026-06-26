const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required', [], 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      return errorResponse(res, 'Unauthorized', [], 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', [], 401);
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Forbidden', [], 403);
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
