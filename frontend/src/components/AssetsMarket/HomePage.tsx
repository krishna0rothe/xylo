import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Header from './Header';
import Footer from './Footer';
import AssetCard from './AssetCard';
import { Asset } from './types';
import { toast } from 'react-hot-toast';

const categories = [
  { id: '1', name: '3D Models', endpoint: '3D Models' },
  { id: '2', name: 'Textures', endpoint: 'Textures' },
  { id: '3', name: 'Audio', endpoint: 'Audio' },
  { id: '4', name: 'Code Blocks', endpoint: 'Code-Blocks' },
  { id: '5', name: 'Maps', endpoint: 'Maps' },
];

const HomePage: React.FC = () => {
  const [categoryAssets, setCategoryAssets] = useState<{ [key: string]: Asset[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      for (const category of categories) {
        try {
          const response = await axios.get(`/api/asset/category/${category.endpoint}`, { headers });
          if (response.data.status === 'success' && response.data.assets.length > 0) {
            setCategoryAssets(prev => ({ ...prev, [category.name]: response.data.assets }));
          }
        } catch (error) {
          console.error(`Error fetching assets for ${category.name}:`, error);
          toast.error(`Failed to fetch ${category.name} assets. Please try again later.`);
        }
      }
      setLoading(false);
    };

    fetchAssets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header />
        <main className="flex-grow container mx-auto py-8 flex justify-center items-center">
          <p className="text-xl">Loading assets...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to Xylo Assets</h1>
        {categories.map(category => {
          const assets = categoryAssets[category.name];
          if (!assets || assets.length === 0) return null;

          return (
            <section key={category.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {assets.map(asset => (
                  <AssetCard key={asset._id} asset={asset} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

