import { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@components/common/Button';
import MessageAlert from '@components/common/MessageAlert';
import InputField from '@components/forms/InputField';

import {
  hasAuthValidationErrors,
  validateLoginForm,
} from '../validation/authValidation';

const INITIAL_LOGIN_VALUES = {
  email: '',
  password: '',
};

function LoginForm({
  onSubmit,
  isSubmitting = false,
  submitError = '',
  successMessage = '',
}) {
  const [formData, setFormData] = useState(INITIAL_LOGIN_VALUES);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[name];

        return nextErrors;
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateLoginForm(formData);

    setErrors(validationErrors);

    if (hasAuthValidationErrors(validationErrors)) {
      return;
    }

    onSubmit({
      email: formData.email.trim(),
      password: formData.password,
    });
  }

  return (
    <>
      {submitError && (
        <div className='mb-4'>
          <MessageAlert
            type='error'
            title='Login failed'
            message={submitError}
          />
        </div>
      )}

      {successMessage && (
        <div className='mb-4'>
          <MessageAlert
            type='success'
            title='Registration completed'
            message={successMessage}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4' noValidate>
        <InputField
          label='Email'
          id='login-email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='freelancer@example.com'
          autoComplete='email'
          disabled={isSubmitting}
          error={errors.email}
          required={true}
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
          disabled={isSubmitting}
          error={errors.password}
          required={true}
        />

        <Button
          type='submit'
          disabled={isSubmitting}
          fullWidth
          className='min-h-11'>
          {isSubmitting ? 'Logging in...' : 'Login'}
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
    </>
  );
}

export default LoginForm;
