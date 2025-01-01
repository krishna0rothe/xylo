import React, { useState } from 'react';
import axios from '../../api/axios';

interface GameData {
  name: string;
  description: string;
  images: string[];
  platform: string[];
  category: string;
  price: number;
  req: {
    min: string;
    max: string;
  };
  tags: string[];
  version: string;
}

const AddGame: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>({
    name: '',
    description: '',
    images: [''],
    platform: [],
    category: '',
    price: 0,
    req: {
      min: '',
      max: ''
    },
    tags: [],
    version: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGameData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setGameData(prevData => ({
      ...prevData,
      platform: checked
        ? [...prevData.platform, value]
        : prevData.platform.filter(p => p !== value)
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setGameData(prevData => ({
      ...prevData,
      tags
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setGameData(prevData => {
      const newImages = [...prevData.images];
      newImages[index] = value;
      return { ...prevData, images: newImages };
    });
  };

  const addImageUrlField = () => {
    if (gameData.images.length < 6) {
      setGameData(prevData => ({
        ...prevData,
        images: [...prevData.images, '']
      }));
    }
  };

  const removeImageUrlField = (index: number) => {
    setGameData(prevData => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('api/studio/add-game', {
        ...gameData,
        images: gameData.images.filter(url => url.trim() !== '')
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Game published successfully:', response.data);
      // Reset form or show success message
    } catch (error) {
      console.error('Error publishing game:', error);
      // Show error message
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">Publish New Game</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block mb-2 font-semibold">Game Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={gameData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2 font-semibold">Description</label>
          <textarea
            id="description"
            name="description"
            value={gameData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            rows={4}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Image URLs (Max 6)</label>
          {gameData.images.map((url, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                className="flex-grow px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeImageUrlField(index)}
                  className="ml-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {gameData.images.length < 6 && (
            <button
              type="button"
              onClick={addImageUrlField}
              className="mt-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Image URL
            </button>
          )}
        </div>
        <div>
          <label className="block mb-2 font-semibold">Platform</label>
          <div className="space-x-4">
            {['mobile', 'desktop', 'web'].map(platform => (
              <label key={platform} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="platform"
                  value={platform}
                  checked={gameData.platform.includes(platform)}
                  onChange={handlePlatformChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                {platform}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block mb-2 font-semibold">Category</label>
          <select
            id="category"
            name="category"
            value={gameData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="puzzle">Puzzle</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="strategy">Strategy</option>
          </select>
        </div>
        <div>
          <label htmlFor="price" className="block mb-2 font-semibold">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={gameData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="minReq" className="block mb-2 font-semibold">Minimum Requirements</label>
          <input
            type="text"
            id="minReq"
            name="req.min"
            value={gameData.req.min}
            onChange={(e) => setGameData(prev => ({ ...prev, req: { ...prev.req, min: e.target.value } }))}
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="maxReq" className="block mb-2 font-semibold">Maximum Requirements</label>
          <input
            type="text"
            id="maxReq"
            name="req.max"
            value={gameData.req.max}
            onChange={(e) => setGameData(prev => ({ ...prev, req: { ...prev.req, max: e.target.value } }))}
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="tags" className="block mb-2 font-semibold">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={gameData.tags.join(', ')}
            onChange={handleTagsChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="version" className="block mb-2 font-semibold">Version</label>
          <input
            type="text"
            id="version"
            name="version"
            value={gameData.version}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Publish Game
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;

