import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-slate-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-sm'>
        <h1 className='mb-4 text-2xl font-bold'>Register</h1>

        <p className='mb-4 text-slate-600'>
          Register form will be added in Phase 3.
        </p>

        <p className='text-sm'>
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
