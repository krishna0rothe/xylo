import React, { useState } from 'react';

interface FilterOptions {
  priceRange: [number, number];
  platforms: string[];
  releaseYear: string;
}

interface FilterOptionsMenuProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterOptionsMenu: React.FC<FilterOptionsMenuProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [releaseYear, setReleaseYear] = useState<string>('');

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceRange = [...priceRange] as [number, number];
    newPriceRange[Number(e.target.name)] = Number(e.target.value);
    setPriceRange(newPriceRange);
    onFilterChange({ priceRange: newPriceRange, platforms, releaseYear });
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const platform = e.target.value;
    const newPlatforms = e.target.checked
      ? [...platforms, platform]
      : platforms.filter(p => p !== platform);
    setPlatforms(newPlatforms);
    onFilterChange({ priceRange, platforms: newPlatforms, releaseYear });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReleaseYear(e.target.value);
    onFilterChange({ priceRange, platforms, releaseYear: e.target.value });
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
      >
        {isOpen ? 'Close Filters' : 'Open Filters'}
      </button>
      {isOpen && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-white font-bold mb-2">Filters</h3>
          <div className="mb-4">
            <label className="block text-white mb-2">Price Range</label>
            <div className="flex items-center">
              <input
                type="range"
                name="0"
                min="0"
                max="100"
                value={priceRange[0]}
                onChange={handlePriceChange}
                className="w-full"
              />
              <span className="ml-2 text-white">${priceRange[0]}</span>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="range"
                name="1"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full"
              />
              <span className="ml-2 text-white">${priceRange[1]}</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Platforms</label>
            {['PC', 'Xbox', 'PlayStation'].map(platform => (
              <div key={platform} className="flex items-center">
                <input
                  type="checkbox"
                  id={platform}
                  value={platform}
                  checked={platforms.includes(platform)}
                  onChange={handlePlatformChange}
                  className="mr-2"
                />
                <label htmlFor={platform} className="text-white">{platform}</label>
              </div>
            ))}
          </div>
          <div>
            <label htmlFor="releaseYear" className="block text-white mb-2">Release Year</label>
            <select
              id="releaseYear"
              value={releaseYear}
              onChange={handleYearChange}
              className="w-full bg-gray-700 text-white rounded p-2"
            >
              <option value="">All Years</option>
              {[2020, 2021, 2022, 2023, 2024].map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterOptionsMenu;

