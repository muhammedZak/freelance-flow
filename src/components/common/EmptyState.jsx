function EmptyState({
  title = 'Nothing to display',
  message = 'No data found.',
  actionText,
  onAction,
}) {
  return (
    <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40'>
      <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700'>
        <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' className='h-6 w-6'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M4 7.5A2.5 2.5 0 0 1 6.5 5h3l2 2h6A2.5 2.5 0 0 1 20 9.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z' />
        </svg>
      </div>

      <h3 className='mt-4 font-semibold text-slate-950 dark:text-white'>{title}</h3>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400'>{message}</p>

      {actionText && onAction && (
        <button type='button' onClick={onAction} className='mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500'>
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
