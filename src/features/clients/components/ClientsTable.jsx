import ClientTableRow from './ClientTableRow';

function ClientsTable({ clients, loading, onDelete }) {
  return (
    <div className='overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70'>
      <table className='w-full border-collapse text-left text-sm'>
        <thead>
          <tr className='border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70'>
            <th className='p-3 text-slate-700 dark:text-slate-300'>Name</th>

            <th className='p-3 text-slate-700 dark:text-slate-300'>Company</th>

            <th className='p-3 text-slate-700 dark:text-slate-300'>Email</th>

            <th className='p-3 text-slate-700 dark:text-slate-300'>Status</th>

            <th className='p-3 text-slate-700 dark:text-slate-300'>Created</th>

            <th className='p-3 text-slate-700 dark:text-slate-300'>Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <ClientTableRow
              key={client.id}
              client={client}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      {loading && (
        <p
          role='status'
          className='border-t border-slate-200 p-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400'>
          Updating clients.
        </p>
      )}
    </div>
  );
}

export default ClientsTable;
