function ErrorMessage({
  message,
  title = 'Something went wrong',
  onRetry,
  retryText = 'Try Again',
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      role='alert'
      className='rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-500/20 dark:bg-red-500/10'>
      <p className='font-semibold text-red-800 dark:text-red-300'>{title}</p>

      <p className='mt-1 text-sm leading-6 text-red-700 dark:text-red-300/80'>
        {message}
      </p>

      {onRetry && (
        <button
          type='button'
          onClick={onRetry}
          className='mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900'>
          {retryText}
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
