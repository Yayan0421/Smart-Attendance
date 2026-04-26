import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wifi,
  Radio,
  FileText,
  User,
  LogOut,
  X,
} from 'lucide-react';

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Wifi, label: 'RFID Cards', path: '/rfid' },
    { icon: Radio, label: 'Scanning', path: '/scan' },
    { icon: FileText, label: 'Attendance Logs', path: '/attendance-logs' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-[#000B18] to-[#00172D] border-r border-[#0052A2]/20 p-6 transform transition-transform duration-300 z-50 md:z-0 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className="mb-12 mt-6 md:mt-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0052A2] to-[#02386E] rounded-lg flex items-center justify-center">
              <Wifi className="text-white" size={20} />
            </div>
            <h1 className="text-lg font-bold text-white">RFID System</h1>
          </div>
          <p className="text-xs text-gray-400">Attendance Management</p>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 mb-12">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-[#0052A2] to-[#02386E] text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-[#0052A2]/10'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'group-hover:text-[#0052A2]'} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-200 border border-red-500/30"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
