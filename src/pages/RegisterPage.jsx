import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, registerUser } from '../features/auth/authSlice';

import AppLogo from '../components/common/AppLogo';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer',
  });

  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setFormError('Email is required');
      return;
    }

    if (!formData.password.trim()) {
      setFormError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    setFormError('');

    try {
      await dispatch(registerUser(newUser)).unwrap();

      navigate('/login', {
        replace: true,
        state: {
          message: 'Registration successful. Please log in.',
        },
      });
    } catch {
      // Redux already stores the registration error.
    }
  }

  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6'>
      <div className='pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-600/20' />

      <div className='relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30 sm:p-8'>
        <AppLogo className='mb-7' />

        <h1 className='mb-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>
          Create your account
        </h1>

        <p className='mb-6 text-sm text-slate-600 dark:text-slate-400'>
          Set up your workspace and start organizing your freelance work.
        </p>

        {formError && (
          <p
            role='alert'
            className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'>
            {formError}
          </p>
        )}

        {error && (
          <p
            role='alert'
            className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='register-name'
              className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Name
            </label>
            <input
              type='text'
              id='register-name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500'
              placeholder='Your name'
            />
          </div>

          <div>
            <label
              htmlFor='register-email'
              className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Email
            </label>
            <input
              type='email'
              id='register-email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label
              htmlFor='register-role'
              className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Role
            </label>
            <select
              id='register-role'
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'>
              <option value='freelancer'>Freelancer</option>
              <option value='client'>Client</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <div>
            <label
              htmlFor='register-password'
              className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Password
            </label>
            <input
              type='password'
              id='register-password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500'
              placeholder='Minimum 6 characters'
            />
          </div>

          <div>
            <label
              htmlFor='register-confirm-password'
              className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Confirm Password
            </label>
            <input
              type='password'
              id='register-confirm-password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500'
              placeholder='Re-enter password'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='min-h-11 w-full rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:bg-slate-400 dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:bg-slate-700'>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
