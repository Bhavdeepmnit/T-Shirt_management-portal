import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public pages
import LandingPage from './pages/public/LandingPage';
import AdminLogin from './pages/public/AdminLogin';
import OrderForm from './pages/public/OrderForm';
import NotFound from './pages/public/NotFound';
import Unauthorized from './pages/public/Unauthorized';

// Super Admin
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import AdminManagement from './pages/superadmin/AdminManagement';
import AllStudents from './pages/superadmin/AllStudents';
import FormSettings from './pages/superadmin/FormSettings';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import StudentsList from './pages/admin/StudentsList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Super Admin Routes */}
          <Route path="/superadmin" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="admins" element={<AdminManagement />} />
            <Route path="students" element={<AllStudents />} />
            <Route path="settings" element={<FormSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<StudentsList />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontSize: '14px' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
}

export default App;
