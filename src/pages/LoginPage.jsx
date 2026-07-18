import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
        <Link to='/' className='mb-7 inline-flex items-center gap-3 rounded-lg text-slate-950 dark:text-white'>
          <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white dark:bg-blue-600'>FF</span>
          <span className='text-lg font-bold tracking-tight'>Freelance<span className='text-blue-600 dark:text-blue-400'>Flow</span></span>
        </Link>
        <h1 className='mb-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white'>Welcome back</h1>

        <p className='mb-6 text-sm text-slate-600 dark:text-slate-400'>
          Sign in to continue to your freelance workspace.
        </p>

        {formError && (
          <p role='alert' className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'>
            {formError}
          </p>
        )}

        {error && (
          <p role='alert' className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'>
            {error}
          </p>
        )}

        {registrationMessage && (
          <div className='mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300'>
            {registrationMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='login-email' className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300'>Email</label>
            <input
              type='email'
              id='login-email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500'
              placeholder='freelancer@example.com'
            />
          </div>

          <div>
            <label htmlFor='login-password' className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300'>Password</label>
            <input
              type='password'
              id='login-password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500'
              placeholder='123456'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='min-h-11 w-full rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:bg-slate-400 dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:bg-slate-700'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400'>
          <p className='font-semibold text-slate-800 dark:text-slate-200'>Demo accounts</p>
          <div className='mt-2 space-y-1 font-mono text-xs leading-5'>
            <p>freelancer@example.com / 123456</p>
            <p>client@example.com / 123456</p>
            <p>admin@example.com / 123456</p>
          </div>
        </div>

        <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
          New user?{' '}
          <Link to='/register' className='font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'>
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
