function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  disabled = false,
}) {
  return (
    <input
      type='search'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      disabled={disabled}
      className='w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-900'
    />
  );
}

export default SearchInput;
