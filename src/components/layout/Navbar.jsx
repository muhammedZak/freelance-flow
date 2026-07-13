import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { navigationLinks } from '../../utils/navigationLinks';

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const visibleLinks = navigationLinks.filter((link) =>
    link.roles.includes(user?.role),
  );

  function handleLogout() {
    dispatch(logoutUser());
    navigate('/login');
  }

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? 'rounded bg-white px-3 py-1 text-slate-900'
      : 'rounded px-3 py-1 text-slate-200 hover:bg-slate-800';

  return (
    <header className='bg-slate-900 text-white'>
      <div className='mx-auto flex max-w-7xl items-center justify-between p-4'>
        <Link to='/dashboard' className='text-xl font-bold'>
          FreelanceFlow
        </Link>

        <nav className='flex items-center gap-4 text-sm'>
          {isAuthenticated && user && (
            <span className='hidden text-slate-300 sm:inline'>
              {user.name} ({user.role})
            </span>
          )}

          {isAuthenticated ? (
            <button onClick={handleLogout} className='hover:text-slate-300'>
              Logout
            </button>
          ) : (
            <Link to='/login' className='hover:text-slate-300'>
              Login
            </Link>
          )}
        </nav>
      </div>

      {isAuthenticated && user && (
        <div className='border-t border-slate-700 md:hidden'>
          <nav className='mx-auto flex max-w-7xl gap-2 overflow-x-auto p-3 text-sm'>
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
