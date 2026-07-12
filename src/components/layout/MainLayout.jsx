import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className='min-h-screen bg-slate-100'>
      <Navbar />

      <div className='mx-auto flex max-w-7xl gap-4 p-4'>
        <Sidebar />

        <main className='flex-1 rounded-lg bg-white p-6 shadow-sm'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
