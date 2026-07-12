import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <header className='bg-slate-900 text-white'>
      <div className='mx-auto flex max-w-7xl items-center justify-between p-4'>
        <Link to='/dashboard' className='text-xl font-bold'>
          FreelanceFlow
        </Link>

        <nav className='flex gap-4 text-sm'>
          <Link to='/settings' className='hover:text-slate-300'>
            Settings
          </Link>
          <Link to='/login' className='hover:text-slate-300'>
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
