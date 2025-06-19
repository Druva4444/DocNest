import React from 'react';
import { Home, Folder, List, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Home', icon: Home, path: '/home' },
    { name: 'Uploads', icon: Folder, path: '/uploads' },
    { name: 'Plans', icon: List, path: '/plans' },
  ];

  const handleLogout = async () => {
    try {
      await axios.get('/api/logout', { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="flex h-screen text-[#ECDCBF]">
      <nav
        className="group bg-[#D84040] shadow-lg p-4 flex flex-col justify-between transition-all duration-300 ease-in-out
                   w-20 hover:w-60 overflow-hidden"
      >
        {/* Title */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="text-2xl font-bold text-[#F8F2DE]">
              D
            </div>
            <span className="text-2xl font-bold text-[#F8F2DE] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              DocNest
            </span>
          </div>

          {/* Navigation Items */}
          <ul className="space-y-6">
            {navItems.map(({ name, icon: Icon, path }) => {
              const isActive = currentPath === path;

              return (
                <li key={name}>
                  <a
                    href={path}
                    className={`flex items-center space-x-4 px-2 py-2 rounded-md transition-all duration-300 ${
                      isActive
                        ? 'bg-[#F8F2DE] text-red-700 font-semibold'
                        : 'hover:text-red-100'
                    }`}
                  >
                    <Icon
                      size={22}
                      className={`min-w-[24px] ${
                        !isActive ? 'group-hover:scale-100 scale-125 transition-transform' : ''
                      }`}
                    />
                    <span
                      className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      {name}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout & Footer */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 px-2 py-2 rounded-md bg-[#F8F2DE] text-red-700 hover:bg-[#f0e9cb] transition font-semibold"
          >
            <LogOut size={22} className="min-w-[24px] transition-transform group-hover:scale-100 scale-125" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Logout
            </span>
          </button>
          <div className="text-xs text-red-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            © 2025 DocNest
          </div>
        </div>
      </nav>
    </div>
  );
}
