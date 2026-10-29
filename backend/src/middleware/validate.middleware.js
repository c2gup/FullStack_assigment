const { badRequest } = require('../utils/errors');

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return next(badRequest('Validation failed: please check your input', formattedErrors));
  }

  req.body = result.data;
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return next(badRequest('Invalid query parameters', formattedErrors));
  }

  req.query = result.data;
  next();
};

module.exports = {
  validateBody,
  validateQuery,
};
