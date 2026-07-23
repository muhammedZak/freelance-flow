function SectionCard({ title, description, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6 ${className}`}>
      {(title || description) && (
        <div className='mb-5 border-b border-slate-200 pb-4 dark:border-slate-800'>
          {title && (
            <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
              {title}
            </h2>
          )}

          {description && (
            <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}

export default SectionCard;
