const successResponse = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const errorResponse = (res, message = 'Internal Server Error', errors = [], statusCode = 500) =>
  res.status(statusCode).json({ success: false, message, errors });

module.exports = { successResponse, errorResponse };
