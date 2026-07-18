import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
  return (
    <div className='app-shell min-h-screen overflow-x-hidden bg-slate-100 dark:bg-slate-950'>
      <Navbar />

      <div className='mx-auto flex max-w-[90rem] items-start gap-5 px-3 py-4 sm:px-5 lg:px-6 lg:py-6'>
        <Sidebar />

        <main className='app-content min-h-[calc(100vh-7rem)] min-w-0 flex-1 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 sm:p-5 lg:p-7'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
