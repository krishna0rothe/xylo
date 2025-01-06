import React from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
}

const GameCard: React.FC<GameCardProps> = ({ id, name, image, rating, price }) => {
  return (
    <Link to={`/game/${id}`} className="block w-64 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">{name}</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-400'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-white">{rating.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">
            {price === 0 ? 'Free' : `₹${price.toFixed(2)}`}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            {price === 0 ? 'Download' : 'Buy Now'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
