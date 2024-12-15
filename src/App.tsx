import { Routes, Route, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Homepage from './components/Homepage';
import AdminDashboard from './components/admin/AdminDashboard';
import GameDashboard from './components/game/GameDashboard';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import { useGameStore } from './store/gameStore';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const initializeStore = useGameStore(state => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/play" element={<GameDashboard />} />
        <Route path="*" element={
          <>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <Outlet />
          </>
        } />
      </Route>
    </Routes>
  );
}

export default App;
