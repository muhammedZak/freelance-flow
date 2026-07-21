function TextareaField({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  required = false,
  disabled = false,
  error = '',
  className = '',
  ...textareaProps
}) {
  const fieldId = id || name;
  const errorId = `${fieldId}-error`;

  const borderClasses = error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500'
    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/10 dark:border-slate-700 dark:focus:border-blue-500';

  return (
    <div>
      <label
        htmlFor={fieldId}
        className='mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
        {label}

        {required && (
          <span className='ml-1 text-red-500' aria-hidden='true'>
            *
          </span>
        )}
      </label>

      <textarea
        id={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-800 ${borderClasses} ${className}`}
        {...textareaProps}
      />

      {error && (
        <p
          id={errorId}
          role='alert'
          className='mt-1.5 text-sm text-red-600 dark:text-red-400'>
          {error}
        </p>
      )}
    </div>
  );
}

export default TextareaField;
