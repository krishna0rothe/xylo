import React from 'react';
import { FaComments, FaCalendarAlt, FaLaptopCode } from 'react-icons/fa';

const CommunitySection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Join Our Thriving Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <FaComments className="text-4xl text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Forums</h3>
            <p className="text-gray-400">Connect with Developers and Gamers</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <FaCalendarAlt className="text-4xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Upcoming Events</h3>
            <p className="text-gray-400">Join webinars, hackathons, and showcases</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 flex flex-col items-center text-center">
            <FaLaptopCode className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Developer Resources</h3>
            <p className="text-gray-400">Access tools and documentation</p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
            Join the Community
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;

