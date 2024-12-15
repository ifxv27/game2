import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePlayerStore from '../store/1playerStore';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = usePlayerStore();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/play', label: 'Play', requireAuth: true },
    { path: '/admin', label: 'Admin', requireAuth: true, requireAdmin: true },
  ];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">Card Game</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map(
              (item) =>
                ((item.requireAuth && isAuthenticated) ||
                  (!item.requireAuth && !item.requireAdmin) ||
                  (item.requireAdmin && isAdmin)) && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-3 py-2"
                  >
                    <span
                      className={`text-sm font-medium ${
                        location.pathname === item.path
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    {location.pathname === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                        layoutId="navbar-indicator"
                      />
                    )}
                  </Link>
                )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
