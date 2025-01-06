import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to Xylo Asset Marketplace</h2>
        <p className="text-xl mb-8">Discover, buy, and sell high-quality game assets</p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100">
            Browse Marketplace
          </button>
          <button className="bg-transparent border-2 border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-blue-600">
            Upload Your Assets
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

