function Loading({ message = 'Loading data...' }) {
  return (
    <div
      className='flex min-h-40 items-center justify-center'
      role='status'
      aria-live='polite'>
      <div className='text-center'>
        <div className='mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900'></div>

        <p className='mt-3 text-sm text-slate-500'>{message}</p>
      </div>
    </div>
  );
}

export default Loading;
