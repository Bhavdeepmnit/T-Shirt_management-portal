import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import Navbar from '../../components/shared/Navbar';

const AdminLayout = () => (
  <div className="flex min-h-screen bg-surface-50">
    <Sidebar role="admin" />
    <div className="flex-1 ml-64">
      <Navbar />
      <main className="p-6"><Outlet /></main>
    </div>
  </div>
);

export default AdminLayout;
