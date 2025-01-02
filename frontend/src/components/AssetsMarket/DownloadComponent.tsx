import React, { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';

interface DownloadComponentProps {
  assetId: string;
}

const DownloadComponent: React.FC<DownloadComponentProps> = ({ assetId }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/asset/download/${assetId}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `asset_${assetId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download the asset. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
    >
      {downloading ? 'Downloading...' : 'Download Asset'}
    </button>
  );
};

export default DownloadComponent;

