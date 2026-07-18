function ErrorMessage({ message, onRetry, retryText = 'Try Again' }) {
  return (
    <div
      className='rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-500/20 dark:bg-red-500/10'
      role='alert'>
      <p className='font-semibold text-red-800 dark:text-red-300'>Something went wrong</p>

      <p className='mt-1 text-sm leading-6 text-red-700 dark:text-red-300/80'>
        {message || 'Unable to complete the request.'}
      </p>

      {onRetry && (
        <button
          type='button'
          onClick={onRetry}
          className='mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700'>
          {retryText}
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
