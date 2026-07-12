import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-slate-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-sm'>
        <h1 className='mb-4 text-2xl font-bold'>Login</h1>

        <p className='mb-4 text-slate-600'>
          Login form will be added in Phase 3.
        </p>

        <Link to='/dashboard' className='text-sm text-blue-600'>
          Go to dashboard preview
        </Link>

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
