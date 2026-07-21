import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AppLogo from '../components/common/AppLogo';
import Button from '../components/common/Button';
import MessageAlert from '../components/common/MessageAlert';
import InputField from '../components/forms/InputField';

import { clearAuthError, loginUser } from '../features/auth/authSlice';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formError, setFormError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const registrationMessage = location.state?.message;

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

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email.trim()) {
      setFormError('Email is required');
      return;
    }

    if (!formData.password.trim()) {
      setFormError('Password is required');
      return;
    }

    setFormError('');
    dispatch(loginUser(formData));
  }

  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6'>
      <div className='pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-600/20' />

      <div className='relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30 sm:p-8'>
        <AppLogo className='mb-7' />

        <h1 className='mb-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>
          Welcome back
        </h1>

        <p className='mb-6 text-sm text-slate-600 dark:text-slate-400'>
          Sign in to continue to your freelance workspace.
        </p>

        {formError && (
          <div className='mb-4'>
            <MessageAlert
              type='error'
              title='Check your details'
              message={formError}
            />
          </div>
        )}

        {error && (
          <div className='mb-4'>
            <MessageAlert type='error' title='Login failed' message={error} />
          </div>
        )}

        {registrationMessage && (
          <div className='mb-4'>
            <MessageAlert
              type='success'
              title='Registration completed'
              message={registrationMessage}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <InputField
            label='Email'
            id='login-email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='freelancer@example.com'
            autoComplete='email'
          />

          <InputField
            label='Password'
            id='login-password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='123456'
            autoComplete='current-password'
          />

          <Button
            type='submit'
            disabled={loading}
            fullWidth
            className='min-h-11'>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400'>
          <p className='font-semibold text-slate-800 dark:text-slate-200'>
            Demo accounts
          </p>

          <div className='mt-2 space-y-1 font-mono text-xs leading-5'>
            <p>freelancer@example.com / 123456</p>
            <p>client@example.com / 123456</p>
            <p>admin@example.com / 123456</p>
          </div>
        </div>

        <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
          New user?{' '}
          <Link
            to='/register'
            className='font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
