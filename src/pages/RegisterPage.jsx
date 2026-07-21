import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AppLogo from '../components/common/AppLogo';
import Button from '../components/common/Button';
import MessageAlert from '../components/common/MessageAlert';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';

import { clearAuthError, registerUser } from '../features/auth/authSlice';

const roleOptions = [
  {
    value: 'freelancer',
    label: 'Freelancer',
  },
  {
    value: 'client',
    label: 'Client',
  },
  {
    value: 'admin',
    label: 'Admin',
  },
];

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
            <MessageAlert
              type='error'
              title='Registration failed'
              message={error}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <InputField
            label='Name'
            id='register-name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Your name'
            autoComplete='name'
          />

          <InputField
            label='Email'
            id='register-email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='you@example.com'
            autoComplete='email'
          />

          <SelectField
            label='Role'
            id='register-role'
            name='role'
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
          />

          <InputField
            label='Password'
            id='register-password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Minimum 6 characters'
            autoComplete='new-password'
          />

          <InputField
            label='Confirm Password'
            id='register-confirm-password'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='Re-enter password'
            autoComplete='new-password'
          />

          <Button
            type='submit'
            disabled={loading}
            fullWidth
            className='min-h-11'>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
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
