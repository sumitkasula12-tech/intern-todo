import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import taskService from '../services/taskService';
import PageContainer from '../components/PageContainer';
import ErrorBanner from '../components/ErrorBanner';

export default function TaskListPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter & Query state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortByDueDate, setSortByDueDate] = useState('asc');
  const [page, setPage] = useState(1);
  const limit = 8; // Tasks per page

  const fetchTasksList = async () => {
    setLoading(true);
    setError('');
    try {
      const query = {
        limit,
        page,
        sortByDueDate,
      };
      if (search.trim()) query.search = search.trim();
      if (status) query.status = status;
      if (priority) query.priority = priority;

      const data = await taskService.getTasks(query);
      setTasks(data.tasks || []);
      setMeta(data.meta || { page, limit, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve tasks list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when filter parameters change
    setPage(1);
  }, [search, status, priority, sortByDueDate]);

  useEffect(() => {
    fetchTasksList();
  }, [page, search, status, priority, sortByDueDate]);

  const handleStatusChange = async (taskId, newStatus, currentStatus) => {
    try {
      // Backend constraint check: Completed tasks can only be changed back to pending or in_progress
      if (currentStatus === 'completed' && newStatus !== 'pending' && newStatus !== 'in_progress') {
        setError('Completed tasks can only be changed back to pending or in_progress');
        return;
      }
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchTasksList();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleDelete = async (taskId, title) => {
    if (!window.confirm(`Are you sure you want to delete the task "${title}"?`)) {
      return;
    }
    try {
      await taskService.deleteTask(taskId);
      // If we are deleting the last item on the page, go back a page
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTasksList();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  return (
    <PageContainer
      title="Tasks Manager"
      banner={error && <ErrorBanner message={error} />}
    >
      <div className="space-y-6">
        {/* Toolbar & Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* Due Date Sort */}
            <select
              value={sortByDueDate}
              onChange={(e) => setSortByDueDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="asc">Due Date (Earliest First)</option>
              <option value="desc">Due Date (Latest First)</option>
            </select>
          </div>

          {/* New Task Button */}
          <Link
            to="/tasks/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Task
          </Link>
        </div>

        {/* Task List Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <span className="text-4xl">📭</span>
            <h3 className="mt-4 text-base font-bold text-slate-800">No tasks found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or create a new task to get started.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50/70 text-slate-900 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-bold">Title</th>
                    <th className="px-6 py-4 font-bold">Priority</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Due Date</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map((task) => (
                    <tr key={task._id} className="group transition-colors hover:bg-slate-50/40">
                      {/* Title & Description */}
                      <td className="px-6 py-4.5">
                        <div>
                          <div className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {task.title}
                          </div>
                          {task.description && (
                            <p className="mt-1 text-xs text-slate-500 line-clamp-1 max-w-sm">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                          task.priority === 'high' ? 'bg-red-50 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </td>

                      {/* Status Dropdown/Badges */}
                      <td className="px-6 py-4.5">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value, task.status)}
                          className={`rounded-lg border-0 bg-transparent py-1 pl-2 pr-8 text-xs font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer ${
                            task.status === 'completed' ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' :
                            task.status === 'in_progress' ? 'text-blue-700 bg-blue-50 hover:bg-blue-100' :
                            task.status === 'cancelled' ? 'text-slate-500 bg-slate-100 hover:bg-slate-200' :
                            'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Due Date & Overdue flag */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-medium ${task.isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {task.isOverdue && (
                            <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-red-750" title="Overdue Task!">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(task._id, task.status === 'completed' ? 'pending' : 'completed', task.status)}
                            className={`rounded-xl p-2 transition-colors ${
                              task.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-150 font-bold'
                                : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-650'
                            }`}
                            title={task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                          >
                            ✓
                          </button>
                          <Link
                            to={`/tasks/${task._id}/edit`}
                            className={`rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors ${
                              task.status === 'completed' ? 'pointer-events-none opacity-40' : ''
                            }`}
                            title={task.status === 'completed' ? 'Completed tasks cannot be edited' : 'Edit task'}
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(task._id, task.title)}
                            className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                <span className="text-xs font-semibold text-slate-500">
                  Page {meta.page} of {meta.totalPages} (Total {meta.total} tasks)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={meta.page <= 1}
                    onClick={() => setPage(meta.page - 1)}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
                  >
                    &larr; Prev
                  </button>
                  <button
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => setPage(meta.page + 1)}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
