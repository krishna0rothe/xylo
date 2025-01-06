import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  setActiveSection: (section: string) => void;
  userData: {
    name: string;
    email: string;
    logo: string;
  } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveSection, userData }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          <li className="mb-2">
            <button 
              onClick={() => setActiveSection('overview')}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
            >
              Dashboard Overview
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => setActiveSection('addGame')}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
            >
              Add Game
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => setActiveSection('myGames')}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
            >
              My Games
            </button>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => setActiveSection('gameFiles')}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
            >
              Game Files
            </button>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="border-t border-gray-700 pt-4 mt-4">
          {userData && (
            <div className="flex items-center mb-4">
              <img 
                src={userData.logo || 'https://via.placeholder.com/40'} 
                alt="Studio Logo" 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{userData.name}</p>
                <p className="text-sm text-gray-400">{userData.email}</p>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;