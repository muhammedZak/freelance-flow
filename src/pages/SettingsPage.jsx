import useTheme from '../context/useTheme';

function SettingsPage() {
  const { theme, toggleTheme, changeTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  return (
    <div className='max-w-2xl'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-slate-900'>Settings</h1>

        <p className='text-slate-600'>Manage your application appearance.</p>
      </div>

      <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
        <div className='mb-5'>
          <h2 className='text-lg font-bold text-slate-900'>Appearance</h2>

          <p className='text-sm text-slate-500'>
            Select the theme you prefer while using FreelanceFlow.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <button
            type='button'
            onClick={() => changeTheme('light')}
            className={
              theme === 'light'
                ? 'rounded-lg border-2 border-blue-600 bg-blue-50 p-4 text-left'
                : 'rounded-lg border border-slate-300 bg-white p-4 text-left'
            }>
            <span className='block text-lg font-bold text-slate-900'>
              Light Mode
            </span>

            <span className='mt-1 block text-sm text-slate-500'>
              Use a bright background and dark text.
            </span>

            {theme === 'light' && (
              <span className='mt-3 block text-sm font-medium text-blue-600'>
                Currently selected
              </span>
            )}
          </button>

          <button
            type='button'
            onClick={() => changeTheme('dark')}
            className={
              theme === 'dark'
                ? 'rounded-lg border-2 border-blue-500 bg-slate-900 p-4 text-left'
                : 'rounded-lg border border-slate-300 bg-slate-800 p-4 text-left'
            }>
            <span className='block text-lg font-bold text-white'>
              Dark Mode
            </span>

            <span className='mt-1 block text-sm text-slate-300'>
              Use a dark background and light text.
            </span>

            {theme === 'dark' && (
              <span className='mt-3 block text-sm font-medium text-blue-400'>
                Currently selected
              </span>
            )}
          </button>
        </div>

        <div className='mt-6 rounded-lg bg-slate-100 p-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='font-medium text-slate-900'>Current theme</p>

              <p className='text-sm capitalize text-slate-500'>{theme} mode</p>
            </div>

            <button
              type='button'
              onClick={toggleTheme}
              className='rounded bg-slate-900 px-4 py-2 text-sm text-white'>
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>

        <p className='mt-4 text-sm text-slate-500'>
          Your theme preference is saved automatically and remains selected
          after refreshing the page.
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;
