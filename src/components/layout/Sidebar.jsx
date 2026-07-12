import { NavLink } from 'react-router-dom';

function Sidebar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'block rounded bg-slate-900 px-3 py-2 text-white'
      : 'block rounded px-3 py-2 text-slate-700 hover:bg-slate-200';

  return (
    <aside className='hidden w-56 rounded-lg bg-white p-4 shadow-sm md:block'>
      <nav className='space-y-2'>
        <NavLink to='/dashboard' className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to='/clients' className={linkClass}>
          Clients
        </NavLink>

        <NavLink to='/projects' className={linkClass}>
          Projects
        </NavLink>

        <NavLink to='/invoices' className={linkClass}>
          Invoices
        </NavLink>

        <NavLink to='/payments' className={linkClass}>
          Payments
        </NavLink>

        <NavLink to='/admin' className={linkClass}>
          Admin
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
