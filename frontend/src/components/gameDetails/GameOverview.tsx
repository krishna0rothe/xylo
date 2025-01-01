import React from 'react';

interface GameOverviewProps {
  game: {
    description: string;
    category: string;
    tags: string[];
  };
  priceDisplay: string;
}

const GameOverview: React.FC<GameOverviewProps> = ({ game, priceDisplay }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Game Overview</h2>
      <p className="mb-4">{game.description}</p>
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="font-bold">Category:</span> {game.category}
        </div>
        <div className="text-2xl font-bold">{priceDisplay}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {game.tags.map((tag, index) => (
          <span key={index} className="bg-gray-700 text-sm rounded-full px-3 py-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GameOverview;

