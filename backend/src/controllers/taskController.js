const { validationResult } = require('express-validator');
const TaskService = require('../services/taskService');
const { successResponse, errorResponse } = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array().map((err) => err.msg), 400);
    }
    const task = await TaskService.createTask(req.user.id, req.body);
    return successResponse(res, task, 'Task created', 201);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await TaskService.getTasks(req.user.id, req.query);
    return successResponse(res, tasks, 'Tasks retrieved');
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskById(req.user.id, req.params.id);
    return successResponse(res, task, 'Task retrieved');
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array().map((err) => err.msg), 400);
    }
    const task = await TaskService.updateTask(req.user.id, req.params.id, req.body);
    return successResponse(res, task, 'Task updated');
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', errors.array().map((err) => err.msg), 400);
    }
    const task = await TaskService.updateTaskStatus(req.user.id, req.params.id, req.body.status);
    return successResponse(res, task, 'Task status updated');
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await TaskService.softDeleteTask(req.user.id, req.params.id);
    return successResponse(res, null, 'Task deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, updateTaskStatus, deleteTask };
