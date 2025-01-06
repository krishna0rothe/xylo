import React from 'react';
import PurchaseSection from './PurchaseSection';

interface GameInfoProps {
  game: {
    id: string;
    name: string;
    category: string;
    tags: string[];
    platform: string[];
    price: number;
  };
  priceDisplay: string;
  studioName: string;
  studioLogo: string;
}


const GameInfo: React.FC<GameInfoProps> = ({ game, priceDisplay, studioName, studioLogo }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <PurchaseSection 
        gameId={game.id} 
        gameName={game.name}
        price={game.price} 
        priceDisplay={priceDisplay} 
      />
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Developer</h3>
        <div className="flex items-center">
          <img src={studioLogo || '/placeholder-logo.jpg'} alt={studioName} className="w-8 h-8 object-contain mr-2" />
          <span>{studioName}</span>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Category</h3>
        <span className="bg-gray-700 text-sm rounded-full px-3 py-1">{game.category}</span>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Features</h3>
        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag, index) => (
            <span key={index} className="bg-gray-700 text-sm rounded-full px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Platform</h3>
        <div className="flex flex-wrap gap-2">
          {game.platform.map((platform, index) => (
            <span key={index} className="bg-gray-700 text-sm rounded-full px-3 py-1">
              {platform}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;

