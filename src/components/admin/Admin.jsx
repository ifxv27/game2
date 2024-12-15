import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaDatabase, FaHome, FaChartBar, FaCog, FaUsers, FaFire, FaChevronLeft, FaChevronRight, FaPlus, FaBoxOpen, FaUserNinja, FaFistRaised, FaLayerGroup } from 'react-icons/fa';
import usePlayerStore from '../../store/playerStore';
import CardManagement from './1CardManagement';
import CategoryManagement from './CategoryManagement';
import TaskManagement from './TaskManagement';
import Settings from './Settings';
import ClassManagement from './ClassManagement';
import InventorySystem from './InventorySystem';
import MovesAndSkillsManagement from './MovesAndSkillsManagement';
import Dashboard from './Dashboard';
import CardCreationModal from './CardCreationModal';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlayer, isAuthenticated } = usePlayerStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/cards', name: 'Card Management', icon: <FaDatabase /> },
    { path: '/admin/categories', name: 'Categories', icon: <FaLayerGroup /> },
    { path: '/admin/tasks', name: 'Task Management', icon: <FaChartBar /> },
    { path: '/admin/classes', name: 'Class Management', icon: <FaUserNinja /> },
    { path: '/admin/inventory', name: 'Inventory System', icon: <FaBoxOpen /> },
    { path: '/admin/moves-skills', name: 'Moves & Skills', icon: <FaFistRaised /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog /> },
  ];

  useEffect(() => {
    if (!isAuthenticated || !currentPlayer || 
        (currentPlayer.role !== 'admin' && currentPlayer.role !== 'moderator')) {
      navigate('/');
    }
  }, [navigate, isAuthenticated, currentPlayer]);

  const handleBack = () => {
    navigate('/game');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const handleFabClick = () => {
    switch (location.pathname) {
      case '/admin/cards':
        setIsCardModalOpen(true);
        break;
      // Add other cases for different sections
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Grid overlay with neon effect */}
      <div className="absolute inset-0 bg-black/40">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 20, 147, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 20, 147, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen p-4 lg:p-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
            {/* Sidebar Container */}
            <div className={`
              transition-all duration-300 ease-in-out
              ${isCollapsed ? 'w-20' : 'w-64'}
              bg-gray-900/80 backdrop-blur-lg rounded-2xl
              border border-pink-500/20 shadow-lg
              ${isCollapsed ? 'lg:sticky' : 'lg:sticky'}
              top-8 h-[calc(100vh-4rem)]
            `}
            style={{
              boxShadow: '0 0 20px rgba(255, 20, 147, 0.2)'
            }}>
              <div className="flex items-center p-4">
                <button
                  onClick={handleBack}
                  className="text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <FaArrowLeft size={20} />
                </button>
                {!isCollapsed && (
                  <h1 className="text-2xl font-bold text-pink-400 ml-4 whitespace-nowrap">Admin Panel</h1>
                )}
              </div>

              {/* Toggle button */}
              <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 bg-pink-500 hover:bg-pink-600 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
                style={{
                  boxShadow: '0 0 10px rgba(255, 20, 147, 0.5)'
                }}
              >
                {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
              </button>

              <nav className="mt-4 h-[calc(100%-5rem)] overflow-y-auto">
                <ul className="space-y-2 px-2">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                          ${isCurrentPath(item.path)
                            ? 'bg-pink-500/20 text-pink-300'
                            : 'text-gray-400 hover:bg-pink-500/10 hover:text-pink-300'
                          }`}
                        style={{
                          boxShadow: isCurrentPath(item.path) ? '0 0 10px rgba(255, 20, 147, 0.2)' : 'none'
                        }}
                      >
                        <div className="text-xl">{item.icon}</div>
                        {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Main Content Container */}
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-pink-500/20 shadow-lg p-6"
              style={{
                boxShadow: '0 0 20px rgba(255, 20, 147, 0.2)'
              }}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="cards" element={<CardManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="tasks" element={<TaskManagement />} />
                <Route path="classes" element={<ClassManagement />} />
                <Route path="inventory" element={<InventorySystem />} />
                <Route path="moves-skills" element={<MovesAndSkillsManagement />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 z-50"
        style={{
          boxShadow: '0 0 20px rgba(255, 20, 147, 0.3)'
        }}
        onClick={handleFabClick}
      >
        <FaPlus size={24} />
      </button>

      {/* Card Creation Modal */}
      {isCardModalOpen && (
        <CardCreationModal onClose={() => setIsCardModalOpen(false)} />
      )}
    </div>
  );
};

export default Admin;
