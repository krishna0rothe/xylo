import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

