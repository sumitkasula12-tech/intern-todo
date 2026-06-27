const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

const register = async ({ fullName, email, password }) => {
  const existingUser = await userRepository.findUserByEmail(email.toLowerCase());
  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await userRepository.createUser({ fullName, email: email.toLowerCase(), passwordHash });
  const token = generateToken(user._id);

  return { token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, avatarUrl: user.avatarUrl } };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email.toLowerCase());
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);
  return { token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, avatarUrl: user.avatarUrl } };
};

module.exports = { register, login };
