import { Link } from 'react-router-dom';

function ClientsPage() {
  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Clients</h1>
          <p className='text-slate-600'>
            Clients CRUD will be added in Phase 6.
          </p>
        </div>

        <Link
          to='/clients/new'
          className='rounded bg-slate-900 px-4 py-2 text-white'>
          Add Client
        </Link>
      </div>
    </div>
  );
}

export default ClientsPage;
