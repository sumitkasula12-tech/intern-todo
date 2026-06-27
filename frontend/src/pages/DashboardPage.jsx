import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import adminService from '../services/adminService';
import PageContainer from '../components/PageContainer';
import ErrorBanner from '../components/ErrorBanner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // User task stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  
  // Admin stats
  const [adminStats, setAdminStats] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch user tasks
      const data = await taskService.getTasks({ limit: 1000 });
      const tasks = data.tasks || [];
      
      const total = tasks.length;
      const pending = tasks.filter((t) => t.status === 'pending').length;
      const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
      const completed = tasks.filter((t) => t.status === 'completed').length;
      const overdue = tasks.filter((t) => t.isOverdue).length;

      setStats({ total, pending, inProgress, completed, overdue });

      // Sort pending/in_progress by dueDate (nearest first) to show as upcoming tasks
      const upcoming = tasks
        .filter((t) => t.status === 'pending' || t.status === 'in_progress')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);
      setRecentTasks(upcoming);

      // 2. Fetch admin stats if the user is an admin
      if (user?.role === 'admin') {
        setAdminLoading(true);
        try {
          const aStats = await adminService.getStats();
          setAdminStats(aStats);
        } catch (err) {
          console.error('Failed to load admin stats:', err);
        } finally {
          setAdminLoading(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleQuickComplete = async (taskId) => {
    try {
      await taskService.updateTaskStatus(taskId, 'completed');
      // Refresh statistics and list
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  if (loading) {
    return (
      <PageContainer title="Dashboard">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard" banner={error && <ErrorBanner message={error} />}>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Welcome back, {user?.fullName}! 👋
            </h2>
            <p className="text-sm text-slate-500">
              Here is a summary of your task workload and schedule.
            </p>
          </div>
          <Link
            to="/tasks/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Task
          </Link>
        </div>

        {/* Task Counters Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Total Tasks</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">📊</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats.total}</span>
              <span className="text-xs text-slate-400">tasks total</span>
            </div>
          </div>

          {/* Card 2: Pending */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Pending Tasks</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">⏳</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats.pending}</span>
              <span className="text-xs text-slate-400">waiting to start</span>
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">In Progress</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">🚀</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{stats.inProgress}</span>
              <span className="text-xs text-slate-400">active tasks</span>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Overdue Tasks</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">⚠️</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold ${stats.overdue > 0 ? 'text-red-600' : 'text-slate-900'}`}>{stats.overdue}</span>
              <span className="text-xs text-slate-400">past due date</span>
            </div>
          </div>
        </div>

        {/* Dashboard Main Area */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Urgent Checklist */}
          <div className="rounded-2xl border border-slate-100 p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Critical Upcoming Tasks</h3>
              <Link to="/tasks" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                View All Tasks &rarr;
              </Link>
            </div>
            
            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="text-3xl">🎉</span>
                <p className="mt-2 text-sm font-medium text-slate-500">All tasks completed or none created!</p>
                <Link to="/tasks/new" className="mt-3 text-xs font-bold text-indigo-600 hover:underline">
                  Add a new task
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleQuickComplete(task._id)}
                        className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-transparent transition-colors hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                        title="Mark as Completed"
                      >
                        ✓
                      </button>
                      <div>
                        <p className="font-semibold text-slate-800">{task.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            task.priority === 'high' ? 'bg-red-50 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-green-50 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-[11px] ${task.isOverdue ? 'font-semibold text-red-600' : 'text-slate-400'}`}>
                            Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            {task.isOverdue && ' (Overdue)'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/tasks/${task._id}/edit`}
                      className="rounded-lg p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700"
                    >
                      ✏️
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info Sidebar */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Task Completion Rate</h3>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative flex items-center justify-center">
                {/* Visual completion ring */}
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                  <p className="text-xs text-slate-400 mt-1">completed</p>
                </div>
              </div>
              <div className="mt-6 w-full space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Completed Tasks:</span>
                  <span className="font-bold text-slate-800">{stats.completed}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Admin Statistics Section */}
        {user?.role === 'admin' && (
          <div className="rounded-3xl border border-purple-100 bg-purple-50/20 p-6">
            <div className="mb-6 flex items-center justify-between border-b border-purple-50 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <h3 className="font-extrabold text-purple-900">Global Platform Administrator Console</h3>
              </div>
              <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800">
                Authorized Admin Only
              </span>
            </div>

            {adminLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
              </div>
            ) : adminStats ? (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-purple-100/50 bg-white p-4">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wide">Total Users</span>
                  <p className="mt-2 text-2xl font-black text-slate-850">{adminStats.totalUsers}</p>
                </div>
                <div className="rounded-xl border border-purple-100/50 bg-white p-4">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wide">Total Tasks</span>
                  <p className="mt-2 text-2xl font-black text-slate-850">{adminStats.totalTasks}</p>
                </div>
                <div className="rounded-xl border border-purple-100/50 bg-white p-4">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wide">Task Distribution</span>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pending:</span>
                      <span className="font-bold text-slate-700">{adminStats.pendingTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">In Progress:</span>
                      <span className="font-bold text-slate-700">{adminStats.inProgressTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Completed:</span>
                      <span className="font-bold text-slate-700">{adminStats.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cancelled:</span>
                      <span className="font-bold text-slate-700">{adminStats.cancelledTasks}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-purple-600">Failed to load system-wide administrator statistics.</p>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
