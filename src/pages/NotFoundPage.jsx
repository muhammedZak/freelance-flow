import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function NotFoundPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const returnPath = isAuthenticated ? '/dashboard' : '/';

  return (
    <section className='flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8'>
      <div className='w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm'>
        <p className='text-6xl font-bold text-slate-300'>404</p>

        <h1 className='mt-4 text-2xl font-bold text-slate-900'>
          Page not found
        </h1>

        <p className='mt-2 text-sm text-slate-600'>
          The page you requested does not exist or may have been moved.
        </p>

        <Link
          to={returnPath}
          className='mt-6 inline-block rounded bg-slate-900 px-4 py-2 text-white'>
          {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
