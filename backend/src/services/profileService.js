const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const getProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const updateProfile = async (userId, payload) => {
  const user = await userRepository.updateUserById(userId, {
    fullName: payload.fullName,
    phone: payload.phone,
    avatarUrl: payload.avatarUrl,
  });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const validCurrent = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validCurrent) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await userRepository.updateUserById(userId, { passwordHash: newHash });
};

module.exports = { getProfile, updateProfile, changePassword };
