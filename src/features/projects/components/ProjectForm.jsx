function ProjectForm({
  formData,
  formError,
  loading,
  clients,
  isEditMode,
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
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Project Title
        </label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={onChange}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Enter project title'
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Client
        </label>
        <select
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
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Description
        </label>
        <textarea
          name='description'
          value={formData.description}
          onChange={onChange}
          rows='3'
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Project description'></textarea>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label className='mb-1 block text-sm font-medium text-slate-700'>
            Start Date
          </label>
          <input
            type='date'
            name='startDate'
            value={formData.startDate}
            onChange={onChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-slate-700'>
            Deadline
          </label>
          <input
            type='date'
            name='deadline'
            value={formData.deadline}
            onChange={onChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          />
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label className='mb-1 block text-sm font-medium text-slate-700'>
            Budget
          </label>
          <input
            type='number'
            name='budget'
            value={formData.budget}
            onChange={onChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
            placeholder='25000'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-slate-700'>
            Status
          </label>
          <select
            name='status'
            value={formData.status}
            onChange={onChange}
            className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'>
            <option value='planning'>Planning</option>
            <option value='active'>Active</option>
            <option value='completed'>Completed</option>
            <option value='on-hold'>On Hold</option>
          </select>
        </div>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='rounded bg-slate-900 px-4 py-2 text-white disabled:bg-slate-400'>
        {loading ? 'Saving...' : isEditMode ? 'Update Project' : 'Add Project'}
      </button>
    </form>
  );
}

export default ProjectForm;
