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
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6'>
      <div className='pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl' />
      <div className='relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/30 sm:p-8'>
        <Link to='/' className='mb-7 inline-flex items-center gap-3 rounded-lg text-slate-950'>
          <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white'>FF</span>
          <span className='text-lg font-bold tracking-tight'>Freelance<span className='text-blue-600'>Flow</span></span>
        </Link>
        <h1 className='mb-2 text-2xl font-bold tracking-tight text-slate-950'>Welcome back</h1>

        <p className='mb-6 text-sm text-slate-600'>
          Sign in to continue to your freelance workspace.
        </p>

        {formError && (
          <p role='alert' className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {formError}
          </p>
        )}

        {error && (
          <p role='alert' className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </p>
        )}

        {registrationMessage && (
          <div className='mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700'>
            {registrationMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='login-email' className='mb-2 block text-sm font-semibold text-slate-700'>Email</label>
            <input
              type='email'
              id='login-email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
              placeholder='freelancer@example.com'
            />
          </div>

          <div>
            <label htmlFor='login-password' className='mb-2 block text-sm font-semibold text-slate-700'>Password</label>
            <input
              type='password'
              id='login-password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='min-h-11 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
              placeholder='123456'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='min-h-11 w-full rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:bg-slate-400'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
          <p className='font-semibold text-slate-800'>Demo accounts</p>
          <div className='mt-2 space-y-1 font-mono text-xs leading-5'>
            <p>freelancer@example.com / 123456</p>
            <p>client@example.com / 123456</p>
            <p>admin@example.com / 123456</p>
          </div>
        </div>

        <p className='mt-6 text-center text-sm text-slate-600'>
          New user?{' '}
          <Link to='/register' className='font-semibold text-blue-600 hover:text-blue-700'>
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
