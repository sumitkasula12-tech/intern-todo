const { errorResponse } = require('../utils/response');

const notFound = (req, res) => {
  errorResponse(res, 'Not Found', [], 404);
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];
  errorResponse(res, message, errors, statusCode);
};

module.exports = { notFound, errorHandler };
