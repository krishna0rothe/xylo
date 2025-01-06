import React, { useState } from 'react';
import axiosInstance from '../../../api/axios';
import { toast } from 'react-hot-toast';

const AddAsset: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('price', price);
    if (file) formData.append('assetFile', file);
    previewImages.forEach((url, index) => {
      if (url) formData.append(`previewImages[${index}]`, url);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('http://localhost:5000/api/asset/add', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      toast.success('Asset added successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setTags('');
      setPrice('');
      setFile(null);
      setPreviewImages(['', '', '']);
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded"
            required
          >
            <option value="">Select a category</option>
            <option value="3D Models">3D Models</option>
            <option value="Textures">Textures</option>
            <option value="Audio">Audio</option>
            <option value="Code Blocks">Code Blocks</option>
            <option value="Maps">Maps</option>
          </select>
        </div>
        <div>
          <label htmlFor="tags" className="block mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block mb-1">Price (INR)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="assetFile" className="block mb-1">Asset File (.zip)</label>
          <input
            type="file"
            id="assetFile"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".zip"
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        {previewImages.map((url, index) => (
          <div key={index}>
            <label htmlFor={`previewImage${index}`} className="block mb-1">Preview Image URL {index + 1}</label>
            <input
              type="url"
              id={`previewImage${index}`}
              value={url}
              onChange={(e) => {
                const newUrls = [...previewImages];
                newUrls[index] = e.target.value;
                setPreviewImages(newUrls);
              }}
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Adding Asset...' : 'Add Asset'}
        </button>
      </form>
    </div>
  );
};

export default AddAsset;

