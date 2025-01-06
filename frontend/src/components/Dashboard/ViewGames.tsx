import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

interface Game {
  _id: string;
  name: string;
  description: string;
  images: string[];
  platform: string[];
  category: string;
  price: number;
  version: string;
  tags: string[];
}

const ViewGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('api/studio/my-games', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setGames(response.data.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">My Games</h2>
      <div className="space-y-6">
        {games.map(game => (
          <div key={game._id} className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
            <img 
              src={game.images[0] || 'https://via.placeholder.com/150'} 
              alt={game.name} 
              className="w-32 h-32 object-cover rounded-md shadow-lg"
            />
            <div className="flex-grow">
              <h3 className="text-2xl font-semibold mb-2">{game.name}</h3>
              <p className="text-gray-200 mb-2">Category: {game.category}</p>
              <p className="text-gray-200 mb-2">Platform: {game.platform.join(', ')}</p>
              <p className="text-gray-200">Version: {game.version}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-300">${game.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewGames;

