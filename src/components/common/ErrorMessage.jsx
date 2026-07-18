function ErrorMessage({ message, onRetry, retryText = 'Try Again' }) {
  return (
    <div
      className='rounded-lg border border-red-200 bg-red-50 p-4'
      role='alert'>
      <p className='font-medium text-red-700'>Something went wrong</p>

      <p className='mt-1 text-sm text-red-600'>
        {message || 'Unable to complete the request.'}
      </p>

      {onRetry && (
        <button
          type='button'
          onClick={onRetry}
          className='mt-3 rounded bg-red-600 px-3 py-2 text-sm text-white'>
          {retryText}
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
