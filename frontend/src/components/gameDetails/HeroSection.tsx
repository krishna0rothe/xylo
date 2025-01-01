import React, { useState } from 'react';

interface HeroSectionProps {
  game: {
    name: string;
    images: string[];
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ game }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-4">{game.name}</h1>
      <div className="relative">
        <img 
          src={game.images[currentImage] || '/placeholder.jpg'} 
          alt={game.name} 
          className="w-full h-[400px] object-cover rounded-lg"
        />
        <div className="absolute bottom-4 left-4 right-4 flex justify-center">
          <div className="flex space-x-2 bg-black bg-opacity-50 rounded-full p-2">
            {game.images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentImage ? 'bg-white' : 'bg-gray-400'}`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 mt-2">
        {game.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${game.name} ${index + 1}`}
            className={`w-full h-20 object-cover rounded-lg cursor-pointer ${index === currentImage ? 'border-2 border-blue-500' : ''}`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

