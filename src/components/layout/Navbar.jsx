import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logoutUser } from '../../features/auth/authSlice';
import { navigationLinks } from '../../utils/navigationLinks';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const visibleLinks = navigationLinks.filter((link) =>
    link.roles.includes(user?.role),
  );

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  function handleLogout() {
    dispatch(logoutUser());
    navigate('/login');
  }

  const mobileLinkClass = ({ isActive }) => {
    const baseClasses =
      'shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors';

    if (isActive) {
      return `${baseClasses} bg-slate-900 text-white dark:bg-blue-600`;
    }

    return `${baseClasses} text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white`;
  };

  return (
    <header className='sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/80'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        {/* Brand */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className='group flex shrink-0 items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950'>
          <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-blue-600'>
            FF
          </span>

          <span className='hidden text-lg font-bold tracking-tight text-slate-900 sm:block dark:text-white'>
            Freelance
            <span className='text-blue-600 dark:text-blue-400'>Flow</span>
          </span>
        </Link>

        {/* Right section */}
        <nav className='flex min-w-0 items-center gap-3'>
          {isAuthenticated && user && (
            <div className='hidden items-center gap-3 sm:flex'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                {userInitial}
              </div>

              <div className='min-w-0 text-left'>
                <p className='max-w-40 truncate text-sm font-semibold text-slate-900 dark:text-white'>
                  {user.name}
                </p>

                <p className='text-xs capitalize text-slate-500 dark:text-slate-400'>
                  {user.role}
                </p>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <button
              type='button'
              onClick={handleLogout}
              className='inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-slate-950'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.8'
                className='h-4 w-4'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 9V5.625A2.625 2.625 0 0 0 13.125 3h-6.75A2.625 2.625 0 0 0 3.75 5.625v12.75A2.625 2.625 0 0 0 6.375 21h6.75a2.625 2.625 0 0 0 2.625-2.625V15'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 12h9m0 0-3-3m3 3-3 3'
                />
              </svg>

              <span>Logout</span>
            </button>
          ) : (
            <Link
              to='/login'
              className='rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-offset-slate-950'>
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      {isAuthenticated && user && (
        <div className='border-t border-slate-200/80 md:hidden dark:border-slate-800'>
          <nav className='mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 scrollbar-hide'>
            {visibleLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={mobileLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
