import { Link } from 'react-router-dom';

function InvoicesPage() {
  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Invoices</h1>
          <p className='text-slate-600'>
            Invoices CRUD will be added in Phase 9.
          </p>
        </div>

        <Link
          to='/invoices/new'
          className='rounded bg-slate-900 px-4 py-2 text-white'>
          Add Invoice
        </Link>
      </div>
    </div>
  );
}

export default InvoicesPage;
