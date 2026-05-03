import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
    <div className="text-center animate-scale-in">
      <p className="text-8xl mb-4">🚫</p>
      <h1 className="text-4xl font-bold text-surface-900 mb-2">Access Denied</h1>
      <p className="text-surface-500 mb-6">You don't have permission to access this page.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn-secondary">Go Home</Link>
        <Link to="/admin/login" className="btn-primary">Admin Login</Link>
      </div>
    </div>
  </div>
);

export default Unauthorized;
