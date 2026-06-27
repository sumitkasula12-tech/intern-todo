const moment = require('moment');
const taskRepository = require('../repositories/taskRepository');

const buildTaskQuery = ({ userId, status, priority, search }) => {
  const filter = { userId, isDeleted: false };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: 'i' };
  return filter;
};

const createTask = async (userId, payload) => {
  const dueDate = moment(payload.dueDate).startOf('day');
  if (dueDate.isBefore(moment().startOf('day'))) {
    const error = new Error('Due date cannot be in the past');
    error.statusCode = 400;
    throw error;
  }

  const existingDuplicate = await taskRepository.findTasks({ userId, dueDate: dueDate.toDate(), title: payload.title, isDeleted: false });
  if (existingDuplicate.length > 0) {
    const error = new Error('Duplicate task title for the same due date is not allowed');
    error.statusCode = 400;
    throw error;
  }

  const pendingCount = await taskRepository.countTasks({
    userId,
    dueDate: dueDate.toDate(),
    status: 'pending',
    isDeleted: false,
  });
  if (payload.status === 'pending' || !payload.status) {
    if (pendingCount >= 10) {
      const error = new Error('Cannot create more than 10 pending tasks for the same due date');
      error.statusCode = 400;
      throw error;
    }
  }

  const task = await taskRepository.createTask({
    userId,
    title: payload.title,
    description: payload.description || '',
    priority: payload.priority,
    status: payload.status || 'pending',
    dueDate: dueDate.toDate(),
  });

  return task;
};

const addOverdueFlag = (task) => {
  const isOverdue = moment(task.dueDate).isBefore(moment(), 'day') && task.status !== 'completed';
  return { ...task.toObject(), isOverdue };
};

const getTasks = async (userId, query) => {
  const filter = buildTaskQuery({ userId, status: query.status, priority: query.priority, search: query.search });
  const sort = {};
  if (query.sortByDueDate) sort.dueDate = query.sortByDueDate === 'desc' ? -1 : 1;

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const tasks = await taskRepository.findTasks(filter, { sort, skip, limit });
  const total = await taskRepository.countTasks(filter);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    tasks: tasks.map(addOverdueFlag),
  };
};

const getTaskById = async (userId, taskId) => {
  const task = await taskRepository.findTaskByIdAndUser(taskId, userId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return addOverdueFlag(task);
};

const updateTask = async (userId, taskId, payload) => {
  const task = await taskRepository.findTaskByIdAndUser(taskId, userId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (task.status === 'completed') {
    const error = new Error('Completed tasks cannot be edited');
    error.statusCode = 400;
    throw error;
  }

  const dueDate = moment(payload.dueDate).startOf('day');
  if (dueDate.isBefore(moment().startOf('day'))) {
    const error = new Error('Due date cannot be in the past');
    error.statusCode = 400;
    throw error;
  }

  const existingDuplicate = await taskRepository.findTasks({
    userId,
    dueDate: dueDate.toDate(),
    title: payload.title,
    isDeleted: false,
    _id: { $ne: taskId },
  });
  if (existingDuplicate.length > 0) {
    const error = new Error('Duplicate task title for the same due date is not allowed');
    error.statusCode = 400;
    throw error;
  }

  const pendingFilter = {
    userId,
    dueDate: dueDate.toDate(),
    status: 'pending',
    isDeleted: false,
    _id: { $ne: taskId },
  };
  const pendingCount = await taskRepository.countTasks(pendingFilter);
  if ((payload.status === 'pending' || task.status === 'pending') && pendingCount >= 10) {
    const error = new Error('Cannot have more than 10 pending tasks for the same due date');
    error.statusCode = 400;
    throw error;
  }

  const updatedTask = await taskRepository.updateTaskById(taskId, {
    title: payload.title,
    description: payload.description || '',
    priority: payload.priority,
    status: payload.status || task.status,
    dueDate: dueDate.toDate(),
  });
  return addOverdueFlag(updatedTask);
};

const updateTaskStatus = async (userId, taskId, status) => {
  const task = await taskRepository.findTaskByIdAndUser(taskId, userId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (task.status === 'completed' && status !== 'pending' && status !== 'in_progress') {
    const error = new Error('Completed tasks can only be changed back to pending or in_progress');
    error.statusCode = 400;
    throw error;
  }

  const updatedTask = await taskRepository.updateTaskById(taskId, { status });
  return addOverdueFlag(updatedTask);
};

const softDeleteTask = async (userId, taskId) => {
  const task = await taskRepository.findTaskByIdAndUser(taskId, userId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  await taskRepository.updateTaskById(taskId, { isDeleted: true });
};

module.exports = { createTask, getTasks, getTaskById, updateTask, updateTaskStatus, softDeleteTask };
