import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineUsers, HiOutlineUserGroup, HiOutlineCog, HiOutlineChartBar } from 'react-icons/hi';
import { HiOutlineDocumentArrowDown } from 'react-icons/hi2';

const superadminLinks = [
  { to: '/superadmin/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/superadmin/admins', label: 'Manage Admins', icon: HiOutlineUsers },
  { to: '/superadmin/students', label: 'All Students', icon: HiOutlineUserGroup },
  { to: '/superadmin/settings', label: 'Form Settings', icon: HiOutlineCog },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: HiOutlineChartBar },
  { to: '/admin/students', label: 'My Students', icon: HiOutlineUserGroup },
];

const Sidebar = ({ role }) => {
  const links = role === 'superadmin' ? superadminLinks : adminLinks;

  return (
    <aside className="w-64 min-h-screen bg-surface-950 text-white flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-xl shadow-glow">
            👕
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">MNIT T-Shirt</h1>
            <p className="text-xs text-surface-400">
              {role === 'superadmin' ? 'Super Admin Panel' : 'Admin Panel'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-surface-500 text-center">MNIT Jaipur © 2024</p>
      </div>
    </aside>
  );
};

export default Sidebar;
