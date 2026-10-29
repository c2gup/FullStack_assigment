const jwt = require('jsonwebtoken');

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'default_super_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'default_super_secret_jwt_key_2026';
  return jwt.verify(token, secret);
};

module.exports = {
  signToken,
  verifyToken,
};
