import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import AppLogo from '@components/common/AppLogo';

import LoginForm from '../components/LoginForm';
import { clearAuthErrors } from '../slices/authSlice';
import { loginUser } from '../thunks/authThunks';
import {
  selectIsAuthenticated,
  selectIsLoginLoading,
  selectLoginError,
} from '../selectors/authSelectors';

function getPostLoginPath(location) {
  const previousLocation = location.state?.from;

  if (!previousLocation?.pathname) {
    return '/dashboard';
  }

  return `${previousLocation.pathname}${previousLocation.search || ''}${previousLocation.hash || ''}`;
}

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoginLoading = useSelector(selectIsLoginLoading);
  const loginError = useSelector(selectLoginError);

  const registrationMessage = location.state?.message || '';
  const postLoginPath = getPostLoginPath(location);

  useEffect(() => {
    dispatch(clearAuthErrors());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(postLoginPath, {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, postLoginPath]);

  function handleLogin(credentials) {
    dispatch(loginUser(credentials));
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

        <LoginForm
          onSubmit={handleLogin}
          isSubmitting={isLoginLoading}
          submitError={loginError}
          successMessage={registrationMessage}
        />
      </div>
    </section>
  );
}

export default LoginPage;
