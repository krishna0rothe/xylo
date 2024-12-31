import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 mr-4">
              Join Xylo as a Developer
            </button>
            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              Start Playing Games
            </button>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors"><FaFacebookF /></a>
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors"><FaTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors"><FaYoutube /></a>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors mr-4">About Us</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors mr-4">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <p className="text-gray-400">&copy; 2023 Xylo Gaming Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

