function Loading({ message = 'Loading...' }) {
  return (
    <div className='flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <span
          aria-hidden='true'
          className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400'
        />

        <p
          role='status'
          aria-live='polite'
          className='text-sm font-medium text-slate-600 dark:text-slate-400'>
          {message}
        </p>
      </div>
    </div>
  );
}

export default Loading;
