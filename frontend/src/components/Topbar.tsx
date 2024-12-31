import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import SearchBar from './Searchbar';

interface UserData {
  name: string;
  logo: string;
  role: string;
  country: string;
}

const Topbar: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axiosInstance.get('api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          const { name, logo, role, country } = response.data.data;
          setUserData({ name, logo, role, country });
          localStorage.setItem('userData', JSON.stringify({ name, logo, role, country }));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      fetchUserData();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUserData(null);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Xylo
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <div className="relative group">
                  <button 
                    className="text-purple-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  >
                    Categories
                  </button>
                  {isCategoryMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <Link to="/categories/action" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Action</Link>
                        <Link to="/categories/rpg" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">RPG</Link>
                        <Link to="/categories/strategy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Strategy</Link>
                        <Link to="/categories/puzzle" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Puzzle</Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/new-releases" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">New Releases</Link>
                <Link to="/top-sellers" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Top Sellers</Link>
                <Link to="/deals" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Deals</Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <SearchBar />
            <button className="ml-4 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {userData ? (
              <div className="ml-3 relative">
                <div>
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" 
                    id="user-menu" 
                    aria-expanded="false" 
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src={userData.logo} alt={userData.name} />
                  </button>
                </div>
                {isMenuOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" 
                    role="menu" 
                    aria-orientation="vertical" 
                    aria-labelledby="user-menu"
                  >
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Profile</Link>
                    <Link to="/library" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">My Library</Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Wishlist</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="ml-4 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;

