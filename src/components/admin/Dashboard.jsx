import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { FaTasks, FaLayerGroup, FaInfoCircle } from 'react-icons/fa';

const Dashboard = () => {
  const { cards = [] } = useGameStore();
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-purple-300 mb-4">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-all">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Total Cards</div>
            <FaLayerGroup className="text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 mt-2">{cards?.length || 0}</div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-all">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Starter Cards</div>
            <FaTasks className="text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-300 mt-2">
            {cards?.filter(card => card.category === 'Starter')?.length || 0}
          </div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-all">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">System Status</div>
            <FaInfoCircle className="text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-300 mt-2">Active</div>
        </div>
      </div>

      <div className="bg-gray-700/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">Recent Cards</h3>
        <div className="space-y-2">
          {cards && cards.slice(0, 3).map((card) => (
            <div key={card.id} className="text-gray-300 flex justify-between items-center bg-gray-800/50 p-2 rounded">
              <span>{card.name}</span>
              <span className="text-sm text-gray-500">{card.category}</span>
            </div>
          ))}
          {(!cards || cards.length === 0) && (
            <div className="text-gray-500">No cards available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
