import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-slate-900'>Admin</h1>

        <p className='text-slate-600'>
          Welcome, {user?.name}. You can view all application data.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        <AdminLink
          to='/dashboard'
          title='Dashboard'
          description='View application totals and recent activities.'
        />

        <AdminLink
          to='/clients'
          title='Clients'
          description='View and manage all client records.'
        />

        <AdminLink
          to='/projects'
          title='Projects'
          description='View and manage all project records.'
        />

        <AdminLink
          to='/invoices'
          title='Invoices'
          description='View and manage all invoice records.'
        />

        <AdminLink
          to='/payments'
          title='Payments'
          description='View and manage all payment records.'
        />

        <AdminLink
          to='/settings'
          title='Settings'
          description='Manage application appearance.'
        />
      </div>

      <div className='mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <p className='font-medium text-yellow-800'>Student project notice</p>

        <p className='mt-1 text-sm text-yellow-700'>
          This admin page uses simple role-based access. It is not a production
          permission system.
        </p>
      </div>
    </div>
  );
}

function AdminLink({ to, title, description }) {
  return (
    <Link
      to={to}
      className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
      <h2 className='font-bold text-slate-900'>{title}</h2>

      <p className='mt-2 text-sm text-slate-600'>{description}</p>

      <p className='mt-4 text-sm font-medium text-blue-600'>Open {title} →</p>
    </Link>
  );
}

export default AdminPage;
