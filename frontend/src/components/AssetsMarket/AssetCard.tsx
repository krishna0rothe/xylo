import React from 'react';
import { Asset } from './types';
import PurchaseComponent from './PurchaseComponent';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const priceDisplay = asset.price === 0 ? 'Free' : `₹${asset.price.toFixed(2)}`;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <img 
        src={asset.previewImages[0]?.replace(/^"|"$/g, '') || '/placeholder.svg?height=200&width=200'} 
        alt={asset.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-white">{asset.title}</h3>
        <p className="text-gray-400 mb-2 line-clamp-2">{asset.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-xl text-green-400">{priceDisplay}</span>
          <PurchaseComponent asset={asset} />
        </div>
      </div>
    </div>
  );
};

export default AssetCard;

