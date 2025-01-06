import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

interface Game {
  _id: string;
  name: string;
  images: string[];
  file: {
    _id: string;
    fileSize: number;
    location: string;
    type: string;
  } | null;
}

const AddGameFiles: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('api/studio/my-games', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setGames(response.data.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 20 * 1024 * 1024 && file.name.endsWith('.zip')) {
        setSelectedFile(file);
      } else {
        alert('Please select a .zip file that is 20MB or smaller.');
        e.target.value = '';
      }
    }
  };

  const handleUpload = async (gameId: string) => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setCurrentGameId(gameId);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`api/file/upload/${gameId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      setGames(games.map(game => 
        game._id === gameId ? { ...game, file: { _id: 'temp', fileSize: selectedFile.size, location: 'Uploaded', type: '.zip' } } : game
      ));

      setSelectedFile(null);
      setShowUploadModal(false);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setCurrentGameId(null);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">Add Game Files</h2>
      <div className="space-y-6">
        {games.map(game => (
          <div key={game._id} className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
            <img 
              src={game.images[0] || 'https://via.placeholder.com/150'} 
              alt={game.name} 
              className="w-32 h-32 object-cover rounded-md shadow-lg"
            />
            <div className="flex-grow">
              <h3 className="text-2xl font-semibold mb-2">{game.name}</h3>
              {game.file ? (
                <p className="text-gray-400">
                  File uploaded: {game.file.location} ({(game.file.fileSize / (1024 * 1024)).toFixed(2)} MB)
                </p>
              ) : (
                <p className="text-gray-400">No file uploaded</p>
              )}
            </div>
            <div>
              {!game.file && (
                <button
                  onClick={() => {
                    setCurrentGameId(game._id);
                    setShowUploadModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  Add File
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Upload Game File</h3>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".zip"
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
              "
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpload(currentGameId!)}
                disabled={uploading || !selectedFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-300 ease-in-out"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddGameFiles;

