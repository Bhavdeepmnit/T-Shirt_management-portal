import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineBell } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getRoleLabel = (role) => {
    if (role === 'superadmin') return 'Super Admin';
    if (role === 'admin') return 'Branch Admin';
    return 'User';
  };

  return (
    <header className="bg-white border-b border-surface-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">👕</span>
          <span className="font-bold text-surface-900 text-lg hidden sm:block">MNIT T-Shirt Portal</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-surface-800">{user.name}</p>
              <p className="text-xs text-surface-500">
                {getRoleLabel(user.role)}
                {user.branch ? ` · ${user.branch}` : ''}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              className="btn-ghost text-surface-500 hover:text-red-600 flex items-center gap-1.5"
              title="Logout"
            >
              <HiOutlineLogout className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
