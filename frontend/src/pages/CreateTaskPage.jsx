import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import taskService from '../services/taskService';
import PageContainer from '../components/PageContainer';
import ErrorBanner from '../components/ErrorBanner';
import FormInput from '../components/FormInput';

const schema = z.object({
  title: z.string().trim().nonempty('Title is required').max(100, 'Title must be max 100 characters'),
  description: z.string().trim().optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' }),
  }),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  dueDate: z.string().nonempty('Due date is required').refine((val) => {
    const selected = new Date(val);
    if (isNaN(selected.getTime())) return false;
    // Strip hours to compare dates only
    const selectedDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return selectedDate >= todayDate;
  }, 'Due date cannot be in the past'),
});

export default function CreateTaskPage() {
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0], // Default to today's date local
    },
  });

  const onSubmit = async (values) => {
    setApiError('');
    setLoading(true);
    try {
      await taskService.createTask(values);
      navigate('/tasks');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Create New Task"
      banner={apiError && <ErrorBanner message={apiError} />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
        {/* Title */}
        <FormInput
          label="Title"
          name="title"
          register={register}
          errors={errors}
          placeholder="Enter task title"
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows="4"
            {...register('description')}
            placeholder="Add detailed task notes..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-xs text-red-650">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              {...register('priority')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-xs text-red-650">{errors.priority.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-650">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-650">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <Link
            to="/tasks"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </PageContainer>
  );
}
