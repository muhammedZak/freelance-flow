import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { navigationLinks } from '../../utils/navigationLinks';

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const visibleLinks = navigationLinks.filter((link) =>
    link.roles.includes(user?.role),
  );

  const linkClass = ({ isActive }) => {
    const baseClasses =
      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200';

    if (isActive) {
      return `${baseClasses} bg-slate-900 text-white shadow-sm dark:bg-blue-600`;
    }

    return `${baseClasses} text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white`;
  };

  return (
    <aside className='sticky top-20 hidden h-fit w-60 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block'>
      {/* Sidebar heading */}
      <div className='border-b border-slate-100 px-5 py-4 dark:border-slate-800'>
        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500'>
          Workspace
        </p>

        <p className='mt-1 text-sm font-medium text-slate-900 dark:text-white'>
          Main navigation
        </p>
      </div>

      {/* Navigation links */}
      <nav className='space-y-1 p-3'>
        {visibleLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/dashboard'}
            className={linkClass}>
            <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60' />

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Current user */}
      {user && (
        <div className='border-t border-slate-100 p-3 dark:border-slate-800'>
          <div className='rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-800/70'>
            <p className='truncate text-sm font-semibold text-slate-900 dark:text-white'>
              {user.name}
            </p>

            <p className='mt-0.5 text-xs capitalize text-slate-500 dark:text-slate-400'>
              {user.role} account
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
