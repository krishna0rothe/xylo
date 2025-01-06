import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

interface GameDetails {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  version: string;
  requirements: {
    min: string;
    max: string;
  };
  file: {
    id: string;
    type: string;
  };
}

const DownloadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [gameInfo, setGameInfo] = useState<GameDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchGameInfo();
    }
  }, [navigate, id]);

  const fetchGameInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get(`api/game/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGameInfo(response.data.game);
    } catch (error) {
      console.error('Error fetching game info:', error);
      setError('Failed to load game information.');
    }
  };

  const handleDownload = async () => {
    if (!gameInfo) return;

    setIsDownloading(true);
    setError(null);
    setDownloadProgress(0);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get(`api/file/download/${gameInfo.id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setDownloadProgress(percentCompleted);
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${gameInfo.name}${gameInfo.file.type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
      setDownloadProgress(100);
    } catch (error) {
      console.error('Download error:', error);
      setError('An error occurred while downloading the game. Please try again.');
      setIsDownloading(false);
    }
  };

  if (!gameInfo) {
    return <div className="text-center py-8">Loading game information...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Download {gameInfo.name}</h1>
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <img src={gameInfo.images[0]} alt={gameInfo.name} className="w-full h-64 object-cover rounded-lg mb-4" />
        <p className="text-gray-300 mb-4">{gameInfo.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Price: ${gameInfo.price.toFixed(2)}</span>
          <span className="text-lg font-semibold">Version: {gameInfo.version}</span>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">System Requirements</h3>
          <p className="text-sm text-gray-400">Minimum: {gameInfo.requirements.min}</p>
          <p className="text-sm text-gray-400">Recommended: {gameInfo.requirements.max}</p>
        </div>
        {!isDownloading && downloadProgress === 0 && (
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-4"
          >
            Start Download
          </button>
        )}
        {isDownloading && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
            <p className="text-center">{downloadProgress}% Downloaded</p>
          </div>
        )}
        {downloadProgress === 100 && (
          <p className="text-green-500 text-center mb-4">Download Complete!</p>
        )}
        {error && <div className="text-red-500 mt-2 mb-4">{error}</div>}
        <Link to={`/game/${id}`} className="text-blue-400 hover:text-blue-300">
          Back to Game Page
        </Link>
      </div>
    </div>
  );
};

export default DownloadPage;

