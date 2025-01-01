import React, { useState } from 'react';

interface GameDescriptionProps {
  description: string;
}

const GameDescription: React.FC<GameDescriptionProps> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">About Game</h2>
      <div className={`text-gray-300 ${expanded ? '' : 'max-h-32 overflow-hidden'}`}>
        <p>{description}</p>
      </div>
      {description.length > 200 && (
        <button
          className="text-blue-500 hover:text-blue-400 mt-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default GameDescription;

