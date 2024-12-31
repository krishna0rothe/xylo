import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tropical from '../assets/tropical.jpg';
import space from '../assets/space.jpg';
import cyberpunk from '../assets/cyberpunk.jpg';
import adventure from '../assets/adventure.jpg';
import bilder from '../assets/bilder.jpg';

interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
}

const games: Game[] = [
  { id: '1', name: 'Epic Adventure', description: 'Embark on a journey through mystical lands', image: adventure },
  { id: '2', name: 'Space Odyssey', description: 'Explore the vast universe in this sci-fi epic', image: space },
  { id: '3', name: 'Medieval Conquest', description: 'Build your empire in a world of knights and castles', image: bilder },
  { id: '4', name: 'Cyberpunk Dreams', description: 'Navigate a neon-lit dystopian future', image: cyberpunk },
  { id: '5', name: 'Tropical Paradise', description: 'Relax and build your own island getaway', image: tropical },
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % games.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      {games.map((game, index) => (
        <div
          key={game.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${game.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{game.name}</h2>
              <p className="text-xl mb-8">{game.description}</p>
              <Link
                to={`/game/${game.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Get Now
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {games.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

