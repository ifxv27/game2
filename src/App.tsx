import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/1Nav';
import Home from './pages/Home';
import PlayerDashboard from './components/game/PlayerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePlayer } from './context/PlayerContext';

function App() {
  const { player } = usePlayer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Nav />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayerDashboard />} />
        <Route 
          path="/admin/*" 
          element={
            player?.isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
