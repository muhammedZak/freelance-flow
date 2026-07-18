function Loading({ message = 'Loading data...' }) {
  return (
    <div
      className='flex min-h-64 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60'
      role='status'
      aria-live='polite'>
      <div className='text-center'>
        <div className='mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400'></div>

        <p className='mt-4 text-sm font-medium text-slate-500 dark:text-slate-400'>{message}</p>
      </div>
    </div>
  );
}

export default Loading;
