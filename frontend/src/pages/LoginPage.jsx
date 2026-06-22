import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/PageContainer';
import ErrorBanner from '../components/ErrorBanner';

const schema = z.object({
  email: z.string().nonempty('Email is required').email('Email must be valid'),
  password: z.string().nonempty('Password is required'),
});

export default function LoginPage() {
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setApiError('');
    try {
      const data = await authService.login(values);
      login(data);
      navigate('/dashboard');
    } catch (error) {
      const message = error.isOffline
        ? error.message
        : error.response?.data?.message || 'Login failed';
      setApiError(message);
    }
  };

  return (
    <PageContainer title="Login" banner={apiError && <ErrorBanner message={apiError} />}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" {...register('email')} className="mt-1 w-full rounded border px-3 py-2" />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input type="password" {...register('password')} className="mt-1 w-full rounded border px-3 py-2" />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full rounded bg-indigo-600 px-4 py-2 text-white">Login</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Don&apos;t have an account? <Link to="/register" className="text-indigo-600">Register</Link>
      </p>
    </PageContainer>
  );
}
