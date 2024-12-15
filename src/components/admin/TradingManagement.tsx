import React, { useState, useMemo } from 'react';
import { useTradingStore } from '../../store/tradingStore';
import { usePlayerStore } from '../../store/playerStore';
import { TradeOffer } from '../../types/trading';
import { FaEye, FaTrash, FaFilter } from 'react-icons/fa';

const TradingManagement: React.FC = () => {
  const { tradeOffers } = useTradingStore();
  const { players } = usePlayerStore();
  const [selectedStatus, setSelectedStatus] = useState<TradeOffer['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTradeOffers = useMemo(() => {
    return tradeOffers.filter(offer => {
      const statusMatch = selectedStatus === 'all' || offer.status === selectedStatus;
      
      const senderPlayer = players.find(p => p.id === offer.sender.playerId);
      const receiverPlayer = players.find(p => p.id === offer.receiver.playerId);
      
      const searchMatch = 
        (senderPlayer?.username.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (receiverPlayer?.username.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        offer.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && searchMatch;
    });
  }, [tradeOffers, selectedStatus, searchTerm, players]);

  const handleViewTradeDetails = (tradeOffer: TradeOffer) => {
    // TODO: Implement trade offer details modal
    console.log('View Trade Details:', tradeOffer);
  };

  const handleDeleteTradeOffer = (tradeOfferId: string) => {
    // TODO: Implement trade offer deletion
    console.log('Delete Trade Offer:', tradeOfferId);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Trading Management</h1>

      {/* Filters */}
      <div className="flex mb-4 space-x-4">
        <div className="flex-grow">
          <input 
            type="text" 
            placeholder="Search trades by player or ID" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as TradeOffer['status'] | 'all')}
          className="p-2 border rounded-md"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Trade Offers Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Trade ID</th>
              <th className="p-3 text-left">Sender</th>
              <th className="p-3 text-left">Receiver</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTradeOffers.map(offer => {
              const senderPlayer = players.find(p => p.id === offer.sender.playerId);
              const receiverPlayer = players.find(p => p.id === offer.receiver.playerId);

              return (
                <tr key={offer.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{offer.id.slice(0, 8)}</td>
                  <td className="p-3">{senderPlayer?.username || 'Unknown'}</td>
                  <td className="p-3">{receiverPlayer?.username || 'Unknown'}</td>
                  <td className="p-3">
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs uppercase font-semibold
                        ${offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          offer.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          offer.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          offer.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : 
                          'bg-blue-100 text-blue-800'}
                      `}
                    >
                      {offer.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(offer.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleViewTradeDetails(offer)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleDeleteTradeOffer(offer.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Trade Offer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredTradeOffers.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No trade offers found
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingManagement;
