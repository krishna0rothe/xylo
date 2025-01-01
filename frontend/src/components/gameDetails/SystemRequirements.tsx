import React from 'react';

interface SystemRequirementsProps {
  requirements: {
    min: string;
    max: string;
  };
}

const SystemRequirements: React.FC<SystemRequirementsProps> = ({ requirements }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">System Requirements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg">
        <div>
          <h3 className="text-xl font-semibold mb-2">Minimum</h3>
          <p className="text-gray-300">{requirements.min}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Recommended</h3>
          <p className="text-gray-300">{requirements.max}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemRequirements;

