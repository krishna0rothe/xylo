import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import Header from './Header';
import Footer from './Footer';
import PurchaseComponent from './PurchaseComponent';
import DownloadComponent from './DownloadComponent';
import { Asset } from './types';

const AssetDetailPage: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await axios.get(`/api/assets/${assetId}`);
        setAsset(response.data.asset);
      } catch (error) {
        console.error('Error fetching asset:', error);
        setError('Failed to load asset details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [assetId]);

  const handlePurchaseComplete = () => {
    setPurchased(true);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error || !asset) {
    return <div className="text-red-500">{error || 'Asset not found'}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{asset.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={asset.previewImages[0]?.replace(/^"|"$/g, '') || '/placeholder.svg?height=400&width=400'} 
                  alt={asset.title} 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {asset.previewImages.slice(1).map((img, index) => (
                    <img 
                      key={index} 
                      src={img.replace(/^"|"$/g, '')} 
                      alt={`${asset.title} preview ${index + 2}`} 
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-300 mb-4">{asset.description}</p>
                <p className="text-xl font-bold mb-4">
                  Price: {asset.price === 0 ? 'Free' : `₹${asset.price.toFixed(2)}`}
                </p>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {purchased ? (
                  <DownloadComponent assetId={asset._id} />
                ) : (
                  <PurchaseComponent asset={asset} onPurchaseComplete={handlePurchaseComplete} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssetDetailPage;

