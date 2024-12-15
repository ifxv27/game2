import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaDatabase, FaImage, FaChartBar, FaCog, FaUsers } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/cards', name: 'Card Management', icon: <FaDatabase /> },
    { path: '/admin/images', name: 'Image Generator', icon: <FaImage /> },
    { path: '/admin/analytics', name: 'Analytics', icon: <FaChartBar /> },
    { path: '/admin/users', name: 'User Management', icon: <FaUsers /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="min-h-screen bg-black/95">
      <div className="container mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <div className="grid-container !p-4">
            <h2 className="text-xl font-bold mb-6 text-purple-400">Admin Panel</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-300'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid-container">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
