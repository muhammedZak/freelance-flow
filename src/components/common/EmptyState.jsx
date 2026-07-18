function EmptyState({
  title = 'Nothing to display',
  message = 'No data found.',
  actionText,
  onAction,
}) {
  return (
    <div className='rounded-lg border border-dashed border-slate-300 p-8 text-center'>
      <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl'>
        —
      </div>

      <h3 className='mt-4 font-bold text-slate-900'>{title}</h3>

      <p className='mx-auto mt-2 max-w-md text-sm text-slate-500'>{message}</p>

      {actionText && onAction && (
        <button
          type='button'
          onClick={onAction}
          className='mt-4 rounded bg-slate-900 px-4 py-2 text-sm text-white'>
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
