import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import AddGame from './AddGame';
import ViewGames from './ViewGames';
import AddGameFiles from './AddGameFiles';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'addGame':
        return <AddGame />;
      case 'myGames':
        return <ViewGames />;
      case 'gameFiles':
        return <AddGameFiles />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        setActiveSection={setActiveSection} 
        userData={userData} 
      />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
