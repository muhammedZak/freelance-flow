import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-slate-100 p-6'>
      <div className='max-w-2xl rounded-lg bg-white p-8 text-center shadow-sm'>
        <h1 className='mb-4 text-4xl font-bold text-slate-900'>
          FreelanceFlow
        </h1>

        <p className='mb-6 text-slate-600'>
          A simple React app for freelancers to manage clients, projects, tasks,
          invoices, and payments.
        </p>

        <div className='flex justify-center gap-4'>
          <Link
            to='/login'
            className='rounded bg-slate-900 px-4 py-2 text-white'>
            Login
          </Link>

          <Link
            to='/register'
            className='rounded border border-slate-900 px-4 py-2 text-slate-900'>
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
