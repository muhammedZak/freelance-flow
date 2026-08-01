import { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@components/common/Button';
import MessageAlert from '@components/common/MessageAlert';
import InputField from '@components/forms/InputField';
import SelectField from '@components/forms/SelectField';

import {
  hasAuthValidationErrors,
  validateRegisterForm,
} from '../validation/authValidation';

const INITIAL_REGISTER_VALUES = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'freelancer',
};

const ROLE_OPTIONS = [
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

function RegisterForm({ onSubmit, isSubmitting = false, submitError = '' }) {
  const [formData, setFormData] = useState(INITIAL_REGISTER_VALUES);
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

    if (name === 'password' && errors.confirmPassword) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors.confirmPassword;

        return nextErrors;
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateRegisterForm(formData);

    setErrors(validationErrors);

    if (hasAuthValidationErrors(validationErrors)) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    });
  }

  return (
    <>
      {submitError && (
        <div className='mb-4'>
          <MessageAlert
            type='error'
            title='Registration failed'
            message={submitError}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4' noValidate>
        <InputField
          label='Name'
          id='register-name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Your name'
          autoComplete='name'
          disabled={isSubmitting}
          error={errors.name}
          required={true}
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
          disabled={isSubmitting}
          error={errors.email}
          required={true}
        />

        <SelectField
          label='Role'
          id='register-role'
          name='role'
          value={formData.role}
          onChange={handleChange}
          options={ROLE_OPTIONS}
          disabled={isSubmitting}
          error={errors.role}
          required={true}
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
          disabled={isSubmitting}
          minLength={6}
          error={errors.password}
          required={true}
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
          disabled={isSubmitting}
          minLength={6}
          error={errors.confirmPassword}
          required={true}
        />

        <Button
          type='submit'
          disabled={isSubmitting}
          fullWidth
          className='min-h-11'>
          {isSubmitting ? 'Creating account...' : 'Register'}
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
    </>
  );
}

export default RegisterForm;
