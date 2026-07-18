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

  function handleLogout() {
    dispatch(logoutUser());
    navigate('/login');
  }

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? 'shrink-0 rounded bg-white px-3 py-2 font-medium text-slate-900'
      : 'shrink-0 rounded px-3 py-2 text-slate-200 hover:bg-slate-800';

  return (
    <header className='sticky top-0 z-20 bg-slate-900 text-white shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3'>
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className='shrink-0 text-lg font-bold sm:text-xl'>
          FreelanceFlow
        </Link>

        <nav className='flex min-w-0 items-center gap-3 text-sm'>
          {isAuthenticated && user && (
            <div className='hidden min-w-0 text-right sm:block'>
              <p className='max-w-48 truncate font-medium'>{user.name}</p>

              <p className='text-xs capitalize text-slate-300'>{user.role}</p>
            </div>
          )}

          {isAuthenticated ? (
            <button
              type='button'
              onClick={handleLogout}
              className='shrink-0 rounded border border-slate-600 px-3 py-2 hover:bg-slate-800'>
              Logout
            </button>
          ) : (
            <Link
              to='/login'
              className='rounded border border-slate-600 px-3 py-2 hover:bg-slate-800'>
              Login
            </Link>
          )}
        </nav>
      </div>

      {isAuthenticated && user && (
        <div className='border-t border-slate-700 md:hidden'>
          <nav className='mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-2 text-sm'>
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
