import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import Navbar from '../../components/shared/Navbar';

const SuperAdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="superadmin" />
      <div className="flex-1 lg:ml-64">
        <Navbar />
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
