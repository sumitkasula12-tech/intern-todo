const userRepository = require('../repositories/userRepository');
const taskRepository = require('../repositories/taskRepository');

const getStats = async () => {
  const totalUsers = await userRepository.countUsers();
  const totalTasks = await taskRepository.countTasks({ isDeleted: false });
  const pendingTasks = await taskRepository.countTasks({ status: 'pending', isDeleted: false });
  const inProgressTasks = await taskRepository.countTasks({ status: 'in_progress', isDeleted: false });
  const completedTasks = await taskRepository.countTasks({ status: 'completed', isDeleted: false });
  const cancelledTasks = await taskRepository.countTasks({ status: 'cancelled', isDeleted: false });

  return {
    totalUsers,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    cancelledTasks,
  };
};

module.exports = { getStats };
