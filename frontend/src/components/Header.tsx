import React, { useState } from 'react';
import { FaGamepad, FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaGamepad className="text-3xl text-purple-500 mr-2" />
          <span className="text-2xl font-bold text-white">Xylo</span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">Home</a></li>
            <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">Developers</a></li>
            <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">Gamers</a></li>
            <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">About</a></li>
          </ul>
        </nav>
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden mt-4">
          <ul className="flex flex-col items-center space-y-4">
            <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">Home</a></li>
            <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">Developers</a></li>
            <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">Gamers</a></li>
            <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">About</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;

