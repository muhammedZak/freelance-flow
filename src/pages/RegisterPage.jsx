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
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6'>
      <div className='pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl' />
      <div className='relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/30 sm:p-8'>
        <Link to='/' className='mb-7 inline-flex items-center gap-3 rounded-lg text-slate-950'>
          <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white'>FF</span>
          <span className='text-lg font-bold tracking-tight'>Freelance<span className='text-blue-600'>Flow</span></span>
        </Link>
        <h1 className='mb-2 text-2xl font-bold tracking-tight text-slate-950'>Create your account</h1>

        <p className='mb-6 text-sm text-slate-600'>
          Set up your workspace and start organizing your freelance work.
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

        <form onSubmit={handleSubmit} className='space-y-4 [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-300 [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:outline-none [&_input]:focus:border-blue-500 [&_input]:focus:ring-4 [&_input]:focus:ring-blue-500/10'>
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
            className='min-h-11 w-full rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:bg-slate-400'>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-slate-600'>
          Already have an account?{' '}
          <Link to='/login' className='font-semibold text-blue-600 hover:text-blue-700'>
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
