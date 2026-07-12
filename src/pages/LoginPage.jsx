import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <section className='flex min-h-screen items-center justify-center bg-slate-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-sm'>
        <h1 className='mb-2 text-2xl font-bold text-slate-900'>Login</h1>

        <p className='mb-6 text-sm text-slate-600'>
          Use your fake JSON Server account to login.
        </p>

        {formError && (
          <p className='mb-4 rounded bg-red-100 p-3 text-sm text-red-700'>
            {formError}
          </p>
        )}

        {error && (
          <p className='mb-4 rounded bg-red-100 p-3 text-sm text-red-700'>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-medium'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
              placeholder='freelancer@example.com'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
              placeholder='123456'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded bg-slate-900 px-4 py-2 text-white disabled:bg-slate-400'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='mt-6 rounded bg-slate-100 p-3 text-sm text-slate-700'>
          <p className='font-medium'>Demo accounts:</p>
          <p>freelancer@example.com / 123456</p>
          <p>client@example.com / 123456</p>
          <p>admin@example.com / 123456</p>
        </div>

        <p className='mt-4 text-sm'>
          New user?{' '}
          <Link to='/register' className='text-blue-600'>
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
