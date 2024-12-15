import React from 'react';
import usePlayerStore from '../../store/playerStore';

const ProfileGrid = () => {
  const { currentPlayer } = usePlayerStore();

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-black/40 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold mb-4">Club Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Energy</span>
              <span className="text-purple-400">25</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Wins</span>
              <span className="text-green-400">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">XP</span>
              <span className="text-yellow-400">25</span>
            </div>
          </div>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold mb-4">Street Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Energy</span>
              <span className="text-purple-400">25</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Wins</span>
              <span className="text-green-400">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">XP</span>
              <span className="text-yellow-400">25</span>
            </div>
          </div>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold mb-4">Card Tournament</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Energy</span>
              <span className="text-purple-400">25</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Wins</span>
              <span className="text-green-400">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">XP</span>
              <span className="text-yellow-400">25</span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="bg-black/40 rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold mb-4">Battle Arena</h2>
        <div className="bg-purple-900/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Battle Opponents</h3>
          <div className="text-gray-400">No opponents available</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGrid;
