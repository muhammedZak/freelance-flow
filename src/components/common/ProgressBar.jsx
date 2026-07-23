function ProgressBar({ value = 0, height = 'medium', showLabel = false }) {
  const numberValue = Number(value);

  const safeValue = Number.isFinite(numberValue)
    ? Math.min(Math.max(numberValue, 0), 100)
    : 0;

  const roundedValue = Math.round(safeValue);

  const heightClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4',
  };

  const barHeight = heightClasses[height] || heightClasses.medium;

  return (
    <div className='w-full'>
      {showLabel && (
        <div className='mb-2 flex items-center justify-between text-sm'>
          <span className='font-medium text-slate-700 dark:text-slate-300'>
            Progress
          </span>

          <span className='font-semibold text-slate-900 dark:text-white'>
            {roundedValue}%
          </span>
        </div>
      )}

      <div
        className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${barHeight}`}>
        <div
          className='h-full rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-500'
          style={{ width: `${safeValue}%` }}
          role='progressbar'
          aria-label='Progress'
          aria-valuemin='0'
          aria-valuemax='100'
          aria-valuenow={roundedValue}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
