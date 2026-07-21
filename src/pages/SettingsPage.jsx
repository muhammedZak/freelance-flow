import PageHeader from '../components/common/PageHeader';

import useTheme from '../context/useTheme';

function SettingsPage() {
  const { theme, toggleTheme, changeTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  return (
    <div className='workspace-page max-w-3xl'>
      <PageHeader
        title='Settings'
        description='Manage your application appearance.'
      />

      <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-7'>
        <div className='mb-5'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
            Appearance
          </h2>

          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Select the theme you prefer while using FreelanceFlow.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <button
            type='button'
            onClick={() => changeTheme('light')}
            className={
              theme === 'light'
                ? 'theme-preview-light rounded-2xl border-2 border-blue-600 p-5 text-left shadow-sm'
                : 'theme-preview-light rounded-2xl border p-5 text-left hover:border-slate-400'
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
                ? 'theme-preview-dark rounded-2xl border-2 border-blue-500 p-5 text-left shadow-sm'
                : 'theme-preview-dark rounded-2xl border p-5 text-left hover:border-slate-500'
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

        <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='font-medium text-slate-900 dark:text-white'>
                Current theme
              </p>

              <p className='text-sm capitalize text-slate-500 dark:text-slate-400'>
                {theme} mode
              </p>
            </div>

            <button
              type='button'
              onClick={toggleTheme}
              className='rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500'>
              {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>

        <p className='mt-4 text-sm text-slate-500 dark:text-slate-400'>
          Your theme preference is saved automatically and remains selected
          after refreshing the page.
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;
