import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axios';
import { toast } from 'react-hot-toast';

interface Asset {
  _id: string;
  title: string;
  price: number;
  previewImages: string[];
}

const MyAssets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAssets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('http://localhost:5000/api/asset/my-assets', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAssets(response.data.data);
      } catch (error) {
        console.error('Error fetching my assets:', error);
        toast.error('Failed to fetch assets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyAssets();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Assets</h2>
      {assets.length === 0 ? (
        <p>You haven't uploaded any assets yet.</p>
      ) : (
        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset._id} className="flex items-center bg-gray-800 p-4 rounded-lg">
              <img 
                src={asset.previewImages[0]?.replace(/^"|"$/g, '') || '/placeholder.svg?height=100&width=100'} 
                alt={asset.title} 
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{asset.title}</h3>
                <p className="text-green-400">₹{asset.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssets;

