import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import Header from './Header';
import Footer from './Footer';
import AssetCard from './AssetCard';

const categories: Category[] = [
  { id: '1', name: '3D Models', endpoint: '3D Models' },
  { id: '2', name: 'Textures', endpoint: 'Textures' },
  { id: '3', name: 'Audio', endpoint: 'Audio' },
  { id: '4', name: 'Code Blocks', endpoint: 'Code-Blocks' },
  { id: '5', name: 'Maps', endpoint: 'Maps' },
];

const HomePage: React.FC = () => {
  const [categoryAssets, setCategoryAssets] = useState<{ [key: string]: Asset[] }>({});

  useEffect(() => {
    const fetchAssets = async () => {
      const token = localStorage.getItem('token');
      for (const category of categories) {
        try {
          const response = await axios.get(`/api/asset/category/${category.endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCategoryAssets(prev => ({ ...prev, [category.name]: response.data.assets }));
        } catch (error) {
          console.error(`Error fetching assets for ${category.name}:`, error);
        }
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to Xylo Assets</h1>
        {categories.map(category => (
          <section key={category.id} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryAssets[category.name]?.slice(0, 4).map(asset => (
                <AssetCard key={asset._id} asset={asset} />
              ))}
            </div>
            <Link to={`/category/${category.endpoint}`} className="mt-4 inline-block text-blue-400 hover:text-blue-300">
              View all {category.name}
            </Link>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

