import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axios';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueData {
  totalAssets: number;
  totalRevenue: number;
  totalDownloads: number;
  graphData: {
    date: string;
    totalRevenue: number;
    totalDownloads: number;
  }[];
}

const Revenue: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('http://localhost:5000/api/asset/my-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setRevenueData(response.data.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        toast.error('Failed to fetch revenue data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!revenueData) {
    return <div className="text-center">Failed to load revenue data.</div>;
  }

  const prepareChartData = () => {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 4);

    const chartData = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(fiveDaysAgo);
      date.setDate(fiveDaysAgo.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dataPoint = revenueData.graphData.find(d => d.date === dateString) || {
        date: dateString,
        totalRevenue: 0,
        totalDownloads: 0
      };
      chartData.push(dataPoint);
    }

    return chartData;
  };

  const chartData = prepareChartData();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Revenue Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Assets</h3>
          <p className="text-2xl font-bold">{revenueData.totalAssets}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">₹{revenueData.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Downloads</h3>
          <p className="text-2xl font-bold">{revenueData.totalDownloads}</p>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Revenue and Downloads (Last 5 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="totalRevenue" stroke="#8884d8" name="Revenue (₹)" />
            <Line yAxisId="right" type="monotone" dataKey="totalDownloads" stroke="#82ca9d" name="Downloads" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Revenue;

