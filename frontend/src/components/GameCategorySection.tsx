import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import GameCard from './GameCard';

interface Game {
  _id: string;
  name: string;
  images: string[];
  rating: number;
  price: number;
}

interface GameCategorySectionProps {
  category: string;
  showSection?: boolean;
  gamesCount?: number;
}

const GameCategorySection: React.FC<GameCategorySectionProps> = ({ 
  category, 
  showSection = true, 
  gamesCount = 5 
}) => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    if (showSection) {
      const fetchGames = async () => {
        try {
          const response = await axiosInstance.get(`/api/game/games?category=${category}&limit=${gamesCount}`);
          if (response.data.status === 'success') {
            setGames(response.data.games);
          }
        } catch (error) {
          console.error('Failed to fetch games:', error);
        }
      };

      fetchGames();
    }
  }, [category, showSection, gamesCount]);

  if (!showSection) return null;

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{category}</h2>
        <Link to={`/category/${category}`} className="text-blue-500 hover:text-blue-600">See All</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {games.map(game => (
          <GameCard
            key={game._id}
            id={game._id}
            name={game.name}
            image={game.images[0] || '/placeholder.jpg'}
            rating={game.rating || 0}
            price={game.price}
          />
        ))}
      </div>
    </div>
  );
};

export default GameCategorySection;

