import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-slate-100 p-6'>
      <div className='rounded-lg bg-white p-8 text-center shadow-sm'>
        <h1 className='mb-2 text-3xl font-bold'>404</h1>
        <p className='mb-4 text-slate-600'>Page not found.</p>

        <Link to='/' className='text-blue-600'>
          Go back home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
