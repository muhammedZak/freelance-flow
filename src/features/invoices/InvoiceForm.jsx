import { formatCurrency } from '../../utils/formatCurrency';

function InvoiceForm({
  formData,
  formError,
  loading,
  clients,
  projects,
  invoiceTotal,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      {formError && (
        <p className='rounded bg-red-100 p-3 text-sm text-red-700'>
          {formError}
        </p>
      )}

      <div>
        <label
          htmlFor='invoiceNumber'
          className='mb-1 block text-sm font-medium text-slate-700'>
          Invoice Number
        </label>

        <input
          id='invoiceNumber'
          type='text'
          name='invoiceNumber'
          value={formData.invoiceNumber}
          onChange={onChange}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Example: INV-005'
        />
      </div>

      <div>
        <label
          htmlFor='clientId'
          className='mb-1 block text-sm font-medium text-slate-700'>
          Client
        </label>

        <select
          id='clientId'
          name='clientId'
          value={formData.clientId}
          onChange={onChange}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
          <option value=''>Select client</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.company}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor='projectId'
          className='mb-1 block text-sm font-medium text-slate-700'>
          Project
        </label>

        <select
          id='projectId'
          name='projectId'
          value={formData.projectId}
          onChange={onChange}
          disabled={!formData.clientId}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 disabled:bg-slate-100'>
          <option value=''>
            {formData.clientId ? 'Select project' : 'Select a client first'}
          </option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        {formData.clientId && projects.length === 0 && (
          <p className='mt-1 text-sm text-slate-500'>
            This client has no projects.
          </p>
        )}
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='hoursWorked'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Hours Worked
          </label>

          <input
            id='hoursWorked'
            type='number'
            name='hoursWorked'
            min='0'
            step='0.5'
            value={formData.hoursWorked}
            onChange={onChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
            placeholder='20'
          />
        </div>

        <div>
          <label
            htmlFor='hourlyRate'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Hourly Rate
          </label>

          <input
            id='hourlyRate'
            type='number'
            name='hourlyRate'
            min='0'
            value={formData.hourlyRate}
            onChange={onChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
            placeholder='800'
          />
        </div>
      </div>

      <div className='rounded bg-slate-100 p-4'>
        <p className='text-sm text-slate-500'>Calculated Total</p>

        <p className='mt-1 text-2xl font-bold text-slate-900'>
          {formatCurrency(invoiceTotal)}
        </p>

        <p className='mt-1 text-sm text-slate-500'>
          {Number(formData.hoursWorked || 0)} hours ×{' '}
          {formatCurrency(formData.hourlyRate || 0)}
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label
            htmlFor='issueDate'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Issue Date
          </label>

          <input
            id='issueDate'
            type='date'
            name='issueDate'
            value={formData.issueDate}
            onChange={onChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />
        </div>

        <div>
          <label
            htmlFor='dueDate'
            className='mb-1 block text-sm font-medium text-slate-700'>
            Due Date
          </label>

          <input
            id='dueDate'
            type='date'
            name='dueDate'
            value={formData.dueDate}
            onChange={onChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />
        </div>
      </div>

      <div>
        <label
          htmlFor='status'
          className='mb-1 block text-sm font-medium text-slate-700'>
          Status
        </label>

        <select
          id='status'
          name='status'
          value={formData.status}
          onChange={onChange}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
          <option value='unpaid'>Unpaid</option>
          <option value='paid'>Paid</option>
          <option value='overdue'>Overdue</option>
        </select>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='rounded bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-400'>
        {loading ? 'Saving Invoice...' : 'Create Invoice'}
      </button>
    </form>
  );
}

export default InvoiceForm;
