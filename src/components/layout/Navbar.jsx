import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutUser());
    navigate('/login');
  }

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

          <Link to='/settings' className='hover:text-slate-300'>
            Settings
          </Link>

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
    </header>
  );
}

export default Navbar;
