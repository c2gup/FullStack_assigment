const Employee = require('../models/Employee');
const { signToken } = require('../utils/jwt');
const { conflict, unauthorized, notFound } = require('../utils/errors');

const registerCounselor = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if counselor already exists
  const existingEmployee = await Employee.findOne({ email: normalizedEmail });
  if (existingEmployee) {
    throw conflict(`An account with email '${normalizedEmail}' already exists`);
  }

  // Create new counselor
  const employee = await Employee.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  const token = signToken({ id: employee._id });

  return {
    token,
    employee: employee.toJSON(),
  };
};

const loginCounselor = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Explicitly select password field since it is omitted by default
  const employee = await Employee.findOne({ email: normalizedEmail }).select('+password');
  if (!employee) {
    throw unauthorized('Invalid email or password');
  }

  const isPasswordMatch = await employee.comparePassword(password);
  if (!isPasswordMatch) {
    throw unauthorized('Invalid email or password');
  }

  const token = signToken({ id: employee._id });

  return {
    token,
    employee: employee.toJSON(),
  };
};

const getCounselorProfile = async (counselorId) => {
  const employee = await Employee.findById(counselorId);
  if (!employee) {
    throw notFound('Counselor profile not found');
  }
  return employee.toJSON();
};

module.exports = {
  registerCounselor,
  loginCounselor,
  getCounselorProfile,
};
