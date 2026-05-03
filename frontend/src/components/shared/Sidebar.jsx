import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHome, HiOutlineUsers, HiOutlineUserGroup, HiOutlineCog, HiOutlineChartBar, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = role === 'superadmin' ? superadminLinks : adminLinks;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-xl shadow-glow">
            👕
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">MNIT T-Shirt</h1>
            <p className="text-xs text-slate-400">
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
            onClick={() => setMobileOpen(false)}
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
        <p className="text-xs text-slate-500 text-center">MNIT Jaipur © 2024</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-slate-900 text-white shadow-lg"
        aria-label="Open menu"
      >
        <HiOutlineMenu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <aside
            className="w-64 min-h-screen bg-slate-950 text-white flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-1"
              aria-label="Close menu"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-slate-950 text-white flex-col fixed left-0 top-0 z-40">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
