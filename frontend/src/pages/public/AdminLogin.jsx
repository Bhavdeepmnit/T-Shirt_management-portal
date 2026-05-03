import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineMail } from 'react-icons/hi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(email, password);
      toast.success(`Welcome, ${data.user.name}!`);
      
      if (data.user.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-md animate-scale-in relative z-10">
        {/* Card */}
        <div className="glass-card p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center text-3xl shadow-glow mb-4">
              👕
            </div>
            <h1 className="text-2xl font-bold text-surface-900">Admin Login</h1>
            <p className="text-surface-500 text-sm mt-1">MNIT T-Shirt Order Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mnit.ac.in"
                  className="input-field pl-10"
                  required
                  id="admin-email"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                  id="admin-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center justify-center"
              id="admin-login-btn"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
