import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Publish Without Limits – Keep Full Ownership of Your Games
            </h2>
            <p className="text-gray-400">
              Join our platform and reach millions of gamers worldwide while maintaining complete control over your creations.
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              Upload Your Game Now
            </button>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Discover and Play – Endless Adventures Await!
            </h2>
            <p className="text-gray-400">
              Explore a vast library of games across all genres, from indie gems to blockbuster hits.
            </p>
            <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              Browse Games
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

