const User = require('../models/User');

const createUser = async (data) => {
  const user = new User(data);
  return user.save();
};

const findUserByEmail = async (email) => User.findOne({ email });
const findUserById = async (id) => User.findById(id);
const updateUserById = async (id, updateData) => User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
const countUsers = async () => User.countDocuments();

module.exports = { createUser, findUserByEmail, findUserById, updateUserById, countUsers };
