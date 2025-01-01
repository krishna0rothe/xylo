import React from 'react';

interface DeveloperInfoProps {
  studioName: string;
  studioLogo: string;
}

const DeveloperInfo: React.FC<DeveloperInfoProps> = ({ studioName, studioLogo }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Developer Information</h2>
      <div className="flex items-center">
        <img src={studioLogo || '/placeholder-logo.jpg'} alt={studioName} className="w-16 h-16 object-contain mr-4" />
        <div>
          <h3 className="text-xl font-semibold">{studioName}</h3>
          <p className="text-gray-400">Game Developer</p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperInfo;

