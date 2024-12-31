import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import GameCard from './GameCard';

interface Game {
  _id: string;
  name: string;
  images: string[];
  rating: number;
  price: number;
}

const AllGamesSection: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchGames = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/game/games?page=${page}&limit=20`);
      if (response.data.status === 'success') {
        const newGames = response.data.games;
        setGames(prevGames => [...prevGames, ...newGames]);
        setPage(prevPage => prevPage + 1);
        setHasMore(newGames.length === 20);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
      fetchGames();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-white mb-4">All Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
      {loading && <p className="text-center text-white mt-4">Loading more games...</p>}
      {!hasMore && <p className="text-center text-white mt-4">No more games to load</p>}
    </div>
  );
};

export default AllGamesSection;

