import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
  return (
    <div className='min-h-screen bg-slate-100'>
      <Navbar />

      <div className='mx-auto flex max-w-7xl gap-4 p-4'>
        <Sidebar />

        <main className='min-w-0 flex-1 rounded-lg bg-white p-4 shadow-sm md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
