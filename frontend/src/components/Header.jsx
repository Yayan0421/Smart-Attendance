import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#00172D] border-b border-[#0052A2]/20 px-4 md:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-white hover:text-[#0052A2] transition"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">RFID Attendance System</h1>
          <p className="text-xs text-gray-400">Manage attendance & fines</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0052A2]/10 hover:bg-[#0052A2]/20 border border-[#0052A2]/30 transition text-white"
          >
            <User size={18} />
            <span className="text-sm">{user?.name || 'User'}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-[#00264D] border border-[#0052A2]/30 rounded-lg shadow-lg z-50">
              <button
                onClick={() => navigate('/profile')}
                className="w-full text-left px-4 py-2 hover:bg-[#0052A2]/10 transition text-white text-sm"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-500/10 transition text-red-400 text-sm flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
