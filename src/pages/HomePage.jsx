import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8'>
      <div className='w-full max-w-2xl rounded-xl bg-white p-6 text-center shadow-sm sm:p-10'>
        <p className='mb-3 text-sm font-bold uppercase tracking-wide text-blue-600'>
          Freelancer Management App
        </p>

        <h1 className='text-3xl font-bold text-slate-900 sm:text-4xl'>
          FreelanceFlow
        </h1>

        <p className='mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base'>
          A beginner-friendly React application for managing clients, projects,
          tasks, invoices, and payments in one place.
        </p>

        <div className='mt-7 flex flex-col justify-center gap-3 sm:flex-row'>
          <Link
            to='/login'
            className='rounded bg-slate-900 px-5 py-3 text-white'>
            Login
          </Link>

          <Link
            to='/register'
            className='rounded border border-slate-900 px-5 py-3 text-slate-900'>
            Create Account
          </Link>
        </div>

        <div className='mt-8 grid gap-3 text-left sm:grid-cols-3'>
          <FeatureCard
            title='Manage Work'
            text='Organize clients, projects, and tasks.'
          />

          <FeatureCard
            title='Track Money'
            text='Create invoices and record payments.'
          />

          <FeatureCard
            title='Monitor Progress'
            text='View dashboard summaries and activities.'
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className='rounded-lg bg-slate-100 p-4'>
      <h2 className='font-bold text-slate-900'>{title}</h2>

      <p className='mt-1 text-sm text-slate-600'>{text}</p>
    </div>
  );
}

export default HomePage;
