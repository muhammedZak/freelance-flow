function ErrorMessage({ message }) {
  return (
    <p className='rounded bg-red-100 p-3 text-sm text-red-700'>
      {message || 'Something went wrong.'}
    </p>
  );
}

export default ErrorMessage;
