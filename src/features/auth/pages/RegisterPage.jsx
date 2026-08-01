import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AppLogo from '@components/common/AppLogo';

import RegisterForm from '../components/RegisterForm';
import { clearAuthErrors, resetRegistrationState } from '../slices/authSlice';
import { registerUser } from '../thunks/authThunks';
import {
  selectIsAuthenticated,
  selectIsRegistrationLoading,
  selectRegistrationError,
} from '../selectors/authSelectors';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isRegistrationLoading = useSelector(selectIsRegistrationLoading);
  const registrationError = useSelector(selectRegistrationError);

  useEffect(() => {
    dispatch(clearAuthErrors());
    dispatch(resetRegistrationState());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  async function handleRegister(userData) {
    const resultAction = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/login', {
        replace: true,
        state: {
          message: 'Registration successful. Please log in.',
        },
      });
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

        <RegisterForm
          onSubmit={handleRegister}
          isSubmitting={isRegistrationLoading}
          submitError={registrationError}
        />
      </div>
    </section>
  );
}

export default RegisterPage;
