import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
  return (
    <div className='min-h-screen overflow-x-hidden bg-slate-100'>
      <Navbar />

      <div className='mx-auto flex max-w-7xl items-start gap-4 px-3 py-4 sm:px-4'>
        <Sidebar />

        <main className='min-h-[calc(100vh-6rem)] min-w-0 flex-1 overflow-hidden rounded-lg bg-white p-4 shadow-sm sm:p-5 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
