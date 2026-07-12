import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, registerUser } from '../features/auth/authSlice';

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

  function handleSubmit(event) {
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
    dispatch(registerUser(newUser));
  }

  return (
    <section className='flex min-h-screen items-center justify-center bg-slate-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-sm'>
        <h1 className='mb-2 text-2xl font-bold text-slate-900'>Register</h1>

        <p className='mb-6 text-sm text-slate-600'>
          Create a fake account for this student project.
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
            <label className='mb-1 block text-sm font-medium'>Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
              placeholder='Your name'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium'>Role</label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
              <option value='freelancer'>Freelancer</option>
              <option value='client'>Client</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
              placeholder='Minimum 6 characters'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium'>
              Confirm Password
            </label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
              placeholder='Re-enter password'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded bg-slate-900 px-4 py-2 text-white disabled:bg-slate-400'>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className='mt-4 text-sm'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600'>
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
