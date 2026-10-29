const createAppError = (message, statusCode = 500, errors = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  error.isOperational = true;
  error.errors = errors;
  return error;
};

const badRequest = (message = 'Bad Request', errors = null) => createAppError(message, 400, errors);
const unauthorized = (message = 'Unauthorized access') => createAppError(message, 401);
const forbidden = (message = 'Access forbidden: you do not have permission to perform this action') => createAppError(message, 403);
const notFound = (message = 'Resource not found') => createAppError(message, 404);
const conflict = (message = 'Conflict: resource state conflict') => createAppError(message, 409);

module.exports = {
  createAppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
};
