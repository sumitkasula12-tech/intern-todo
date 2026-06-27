import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import profileService from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/PageContainer';
import ErrorBanner from '../components/ErrorBanner';
import FormInput from '../components/FormInput';

const schema = z.object({
  fullName: z.string().trim().nonempty('Full name is required'),
  phone: z.string().trim().default(''),
  avatarUrl: z.string().trim().default('').refine((val) => {
    if (!val) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, 'Avatar URL must be a valid URL'),
});

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setApiError('');
      try {
        const profile = await profileService.getProfile();
        setAccountDetails(profile);
        reset({
          fullName: profile.fullName,
          phone: profile.phone || '',
          avatarUrl: profile.avatarUrl || '',
        });
      } catch (err) {
        setApiError(err.response?.data?.message || 'Failed to retrieve profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [reset]);

  const onSubmit = async (values) => {
    setApiError('');
    setSuccessMsg('');
    setSaving(true);
    try {
      const updatedProfile = await profileService.updateProfile(values);
      setSuccessMsg('Profile updated successfully!');
      
      // Update global user context state (nav header initials/avatar)
      updateUser({
        ...user,
        fullName: updatedProfile.fullName,
        avatarUrl: updatedProfile.avatarUrl,
        phone: updatedProfile.phone,
      });

      setAccountDetails(updatedProfile);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile settings';
      setApiError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Profile">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Profile Settings"
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
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: General Info & Summary */}
        <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/30 p-6 text-center">
          {/* Avatar Preview */}
          <div className="relative mb-4">
            {accountDetails?.avatarUrl ? (
              <img
                src={accountDetails.avatarUrl}
                alt={accountDetails.fullName}
                className="h-24 w-24 rounded-full border-4 border-indigo-50 object-cover shadow-sm"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    accountDetails.fullName
                  )}&background=6366f1&color=fff&size=128`;
                }}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white shadow-sm border-4 border-indigo-50">
                {accountDetails?.fullName ? accountDetails.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="absolute bottom-0 right-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border-2 border-white">
              {accountDetails?.role}
            </span>
          </div>

          <h3 className="font-bold text-slate-800 text-lg leading-snug">{accountDetails?.fullName}</h3>
          <p className="text-xs text-slate-400 mt-1">{accountDetails?.email}</p>

          <div className="mt-6 w-full space-y-3 text-left border-t border-slate-100 pt-5 text-xs text-slate-500">
            <div>
              <span className="block text-slate-400">Account Type</span>
              <span className="font-semibold text-slate-700 capitalize">{accountDetails?.role}</span>
            </div>
            <div>
              <span className="block text-slate-400">Member Since</span>
              <span className="font-semibold text-slate-700">
                {accountDetails?.createdAt
                  ? new Date(accountDetails.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
            {/* Full Name */}
            <FormInput
              label="Full Name"
              name="fullName"
              register={register}
              errors={errors}
            />

            {/* Email (Read only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">
                Email Address (Cannot change)
              </label>
              <input
                type="email"
                value={accountDetails?.email || ''}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <FormInput
              label="Phone Number"
              name="phone"
              register={register}
              errors={errors}
              placeholder="e.g. +1 555-0199"
            />

            {/* Avatar URL */}
            <FormInput
              label="Avatar Image URL"
              name="avatarUrl"
              register={register}
              errors={errors}
              placeholder="https://example.com/avatar.jpg"
            />

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              
              <Link
                to="/profile/password"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 text-center"
              >
                🔒 Change Password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
