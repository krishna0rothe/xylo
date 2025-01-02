import React from 'react';
import { dummyCategories } from './dummyData';

const CategorySection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dummyCategories.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-semibold">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

