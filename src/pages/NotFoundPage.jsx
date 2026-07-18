import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function NotFoundPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const returnPath = isAuthenticated ? '/dashboard' : '/';

  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8'>
      <div className='pointer-events-none absolute h-80 w-80 rounded-full bg-blue-600/20 blur-3xl' />
      <div className='relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 text-center shadow-2xl shadow-black/30'>
        <p className='text-7xl font-bold tracking-tighter text-slate-200'>404</p>

        <h1 className='mt-4 text-2xl font-bold text-slate-900'>
          Page not found
        </h1>

        <p className='mt-2 text-sm text-slate-600'>
          The page you requested does not exist or may have been moved.
        </p>

        <Link
          to={returnPath}
          className='mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-slate-800'>
          {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
