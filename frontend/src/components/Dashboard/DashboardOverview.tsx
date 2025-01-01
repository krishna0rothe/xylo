import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AnalyticsData {
  summary: {
    totalDownloads: number;
    totalRevenue: number;
    totalGamesPublished: number;
  };
  analytics: {
    downloadsByDay: { date: string; downloads: number }[];
    revenueByDay: { date: string; revenue: number }[];
  };
}

const DashboardOverview: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('api/studio/analytics', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getChartData = (data: { date: string; value: number }[]) => {
    const today = new Date();
    const dates = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return dates.map(date => {
      const dataPoint = data.find(item => item.date === date);
      return dataPoint ? dataPoint.value : 0;
    });
  };

  const chartData = {
    labels: ['4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
    datasets: [
      {
        label: 'Downloads',
        data: getChartData(analyticsData?.analytics.downloadsByDay.map(item => ({ date: item.date, value: item.downloads })) || []),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Revenue',
        data: getChartData(analyticsData?.analytics.revenueByDay.map(item => ({ date: item.date, value: item.revenue })) || []),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Total Games Published</h3>
          <p className="text-3xl font-bold">{analyticsData?.summary.totalGamesPublished || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Total Downloads</h3>
          <p className="text-3xl font-bold">{formatNumber(analyticsData?.summary.totalDownloads || 0)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">${formatNumber(analyticsData?.summary.totalRevenue || 0)}</p>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Analytics</h3>
        <Line 
          data={chartData}
          options={{
            responsive: true,
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: { color: 'white' }
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: { color: 'white' }
              }
            },
            plugins: {
              legend: {
                labels: { color: 'white' }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;

