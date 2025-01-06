import React from 'react';
import { Link } from 'react-router-dom';
import { dummyCategories } from '../dummyData';
import Header from './Header';
import Footer from './Footer';

const MarketplacePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dummyCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h2 className="font-semibold text-xl">{category.name}</h2>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarketplacePage;

