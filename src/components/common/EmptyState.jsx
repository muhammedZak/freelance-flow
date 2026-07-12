function EmptyState({ message }) {
  return (
    <div className='rounded border border-dashed border-slate-300 p-6 text-center'>
      <p className='text-slate-500'>{message || 'No data found.'}</p>
    </div>
  );
}

export default EmptyState;
