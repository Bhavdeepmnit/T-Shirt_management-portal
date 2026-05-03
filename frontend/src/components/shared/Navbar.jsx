import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineLogout } from 'react-icons/hi';

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
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 ml-10 lg:ml-0">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">👕</span>
          <span className="font-bold text-slate-900 text-lg hidden sm:block">MNIT T-Shirt Portal</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user && (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">
                {getRoleLabel(user.role)}
                {user.branch ? ` · ${user.branch}` : ''}
              </p>
            </div>

            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              className="btn-ghost text-slate-500 hover:text-red-600 flex items-center gap-1.5 px-2 sm:px-4"
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
