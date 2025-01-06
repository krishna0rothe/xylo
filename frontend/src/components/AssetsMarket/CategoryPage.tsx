import React from 'react';
import { useParams } from 'react-router-dom';
import { dummyAssets, dummyCategories } from './dummyData';
import Header from './Header';
import Footer from './Footer';
import AssetCard from './AssetCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = dummyCategories.find(c => c.id === categoryId);
  const assets = dummyAssets.filter(asset => asset.category === category?.name);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">{category.name} Assets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;

