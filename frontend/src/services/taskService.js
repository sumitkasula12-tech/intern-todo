import api from './api';

const getTasks = (params) => api.get('/tasks', { params }).then((res) => res.data.data);
const getTask = (id) => api.get(`/tasks/${id}`).then((res) => res.data.data);
const createTask = (payload) => api.post('/tasks', payload).then((res) => res.data.data);
const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload).then((res) => res.data.data);
const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status }).then((res) => res.data.data);
const deleteTask = (id) => api.delete(`/tasks/${id}`).then((res) => res.data.data);

export default { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask };
