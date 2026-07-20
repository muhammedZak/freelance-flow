import { Link } from 'react-router-dom';

function EmptyState({
  message = 'No data available.',
  actionText = '',
  actionTo = '',
}) {
  const hasAction = actionText && actionTo;

  return (
    <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-900/50'>
      <div
        aria-hidden='true'
        className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'>
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='h-6 w-6'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M4 6h16v12H4z'
          />

          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M8 10h8M8 14h5'
          />
        </svg>
      </div>

      <p className='mt-4 text-sm text-slate-600 dark:text-slate-400'>
        {message}
      </p>

      {hasAction && (
        <Link
          to={actionTo}
          className='mt-5 inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500'>
          {actionText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
