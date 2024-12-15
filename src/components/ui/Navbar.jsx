import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaStore,
  FaExchangeAlt,
  FaDice,
  FaUserShield,
} from 'react-icons/fa';
import { usePlayerStore } from '../../store/playerStore';

const Navbar = () => {
  const { currentPlayer, logoutPlayer } = usePlayerStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutPlayer();
    navigate('/');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
            <div className="px-4">
              <div className="flex items-center justify-between h-11">
                {/* Left side - Logo & Navigation */}
                <div className="flex items-center space-x-4">
                  <Link
                    to="/"
                    className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <FaHome size={15} />
                    <span className="font-medium text-sm">Home</span>
                  </Link>
                  {currentPlayer && (
                    <>
                      <Link
                        to="/store"
                        className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <FaStore size={15} />
                        <span className="font-medium text-sm">Store</span>
                      </Link>
                      <Link
                        to="/trade"
                        className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <FaExchangeAlt size={15} />
                        <span className="font-medium text-sm">Trade</span>
                      </Link>
                      <Link
                        to="/play"
                        className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <FaDice size={15} />
                        <span className="font-medium text-sm">Play</span>
                      </Link>
                      {currentPlayer.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <FaUserShield size={15} />
                          <span className="font-medium text-sm">Admin</span>
                        </Link>
                      )}
                    </>
                  )}
                </div>

                {/* Right side - User Menu */}
                <div className="flex items-center space-x-4">
                  {currentPlayer ? (
                    <>
                      <div className="flex items-center gap-1.5 text-purple-400">
                        <FaUser size={15} />
                        <span className="font-medium text-sm">{currentPlayer.name}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <FaSignOutAlt size={15} />
                        <span className="font-medium text-sm">Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/"
                      className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <FaUser size={15} />
                      <span className="font-medium text-sm">Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
