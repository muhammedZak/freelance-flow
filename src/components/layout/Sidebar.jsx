import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { navigationLinks } from '../../utils/navigationLinks';

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const visibleLinks = navigationLinks.filter((link) =>
    link.roles.includes(user?.role),
  );

  const linkClass = ({ isActive }) =>
    isActive
      ? 'block rounded bg-slate-900 px-3 py-2 text-white'
      : 'block rounded px-3 py-2 text-slate-700 hover:bg-slate-200';

  return (
    <aside className='hidden w-56 rounded-lg bg-white p-4 shadow-sm md:block'>
      <nav className='space-y-2'>
        {visibleLinks.map((link) => (
          <NavLink key={link.path} to={link.path} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
