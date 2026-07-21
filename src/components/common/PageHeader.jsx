function PageHeader({ title, company, description, children }) {
  return (
    <header className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
      <div className='min-w-0'>
        <h1 className='text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl'>
          {title}
        </h1>

        {company && <p className='text-slate-600'>{company}</p>}

        {description && (
          <p className='mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base'>
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className='flex shrink-0 flex-wrap items-center gap-2'>
          {children}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
