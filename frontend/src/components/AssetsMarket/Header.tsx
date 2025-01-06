import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Redirect to home or login page
    window.location.href = '/';
  };

  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Xylo Assets</Link>
        <nav className="flex items-center">
          <ul className="flex space-x-4 mr-4">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/marketplace" className="hover:text-gray-300">Marketplace</Link></li>
            <li><Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
          </ul>
          {token ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 hover:text-gray-300"
              >
                <User size={20} />
                <span>Profile</span>
                <ChevronDown size={16} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-700">Dashboard</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700">
                    <LogOut size={16} className="inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-gray-300">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

