import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import usePlayerStore from '../store/1playerStore';

const Nav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = usePlayerStore();
  const isAdmin = username?.toLowerCase() === 'admin' || username?.toLowerCase() === 'mod';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show nav on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 flex justify-center pt-4">
      <div className="px-6 py-2 bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-pink-500/20 shadow-lg">
        <div className="flex items-center space-x-8">
          <Link 
            to={isAdmin ? '/admin' : '/play'} 
            className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-bold text-xl hover:from-pink-400 hover:to-purple-400 transition-all duration-300"
          >
            WHO
          </Link>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
                    ${location.pathname.startsWith('/admin') 
                      ? 'text-pink-400 bg-pink-500/10 border border-pink-500/30' 
                      : 'text-gray-300 hover:text-pink-400 hover:bg-pink-500/10'}`}
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/play"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300
                  ${location.pathname === '/play' 
                    ? 'text-pink-400 bg-pink-500/10 border border-pink-500/30' 
                    : 'text-gray-300 hover:text-pink-400 hover:bg-pink-500/10'}`}
              >
                Play Game
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-pink-400 hover:bg-pink-500/10 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
