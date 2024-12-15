import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1920px] mx-auto bg-black/60 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
