const Task = require('../models/Task');

const createTask = async (data) => new Task(data).save();
const findTaskById = async (id) => Task.findOne({ _id: id, isDeleted: false });
const findTaskByIdAndUser = async (id, userId) => Task.findOne({ _id: id, userId, isDeleted: false });
const findTasks = async (filter, options = {}) => Task.find(filter).sort(options.sort).skip(options.skip).limit(options.limit);
const countTasks = async (filter) => Task.countDocuments(filter);
const updateTaskById = async (id, updateData) => Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

module.exports = { createTask, findTaskById, findTaskByIdAndUser, findTasks, countTasks, updateTaskById };
