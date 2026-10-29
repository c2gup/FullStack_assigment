const { verifyToken } = require('../utils/jwt');
const { unauthorized } = require('../utils/errors');
const Employee = require('../models/Employee');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(unauthorized('Authentication token is missing. Please log in.'));
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(unauthorized('Your session has expired. Please log in again.'));
      }
      return next(unauthorized('Invalid authentication token. Please log in again.'));
    }

    const employee = await Employee.findById(decoded.id);
    if (!employee) {
      return next(unauthorized('The counselor account associated with this token no longer exists.'));
    }

    req.user = employee;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
};
