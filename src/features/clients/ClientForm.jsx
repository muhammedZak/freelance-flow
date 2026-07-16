function ClientForm({
  formData,
  formError,
  loading,
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
          Client Name
        </label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={onChange}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Enter client name'
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Email
        </label>
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={onChange}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='client@example.com'
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Phone
        </label>
        <input
          type='text'
          name='phone'
          value={formData.phone}
          onChange={onChange}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='9876543210'
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Company
        </label>
        <input
          type='text'
          name='company'
          value={formData.company}
          onChange={onChange}
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Company name'
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Address
        </label>
        <textarea
          name='address'
          value={formData.address}
          onChange={onChange}
          rows='3'
          className='w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-slate-900'
          placeholder='Client address'></textarea>
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
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
        </select>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='rounded bg-slate-900 px-4 py-2 text-white disabled:bg-slate-400'>
        {loading ? 'Saving...' : isEditMode ? 'Update Client' : 'Add Client'}
      </button>
    </form>
  );
}

export default ClientForm;
