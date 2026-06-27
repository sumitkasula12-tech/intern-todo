import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import profileService from '../services/profileService';
import PageContainer from '../components/PageContainer';
import ErrorBanner from '../components/ErrorBanner';
import FormInput from '../components/FormInput';

const schema = z
  .object({
    currentPassword: z.string().nonempty('Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmNewPassword: z.string().nonempty('Confirm new password is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords must match',
    path: ['confirmNewPassword'],
  });

export default function ChangePasswordPage() {
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setApiError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await profileService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSuccessMsg('Password changed successfully! Redirecting...');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Change Password"
      banner={
        <>
          {apiError && <ErrorBanner message={apiError} />}
          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              ✓ {successMsg}
            </div>
          )}
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        {/* Current Password */}
        <FormInput
          label="Current Password"
          name="currentPassword"
          type="password"
          register={register}
          errors={errors}
          placeholder="Enter current password"
        />

        {/* New Password */}
        <FormInput
          label="New Password"
          name="newPassword"
          type="password"
          register={register}
          errors={errors}
          placeholder="Enter new password (min 8 characters)"
        />

        {/* Confirm New Password */}
        <FormInput
          label="Confirm New Password"
          name="confirmNewPassword"
          type="password"
          register={register}
          errors={errors}
          placeholder="Re-enter new password"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          
          <Link
            to="/profile"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </PageContainer>
  );
}
