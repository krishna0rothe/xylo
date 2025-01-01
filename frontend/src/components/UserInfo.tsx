import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

interface UserData {
  _id: string;
  name: string;
  email: string;
  country: string;
  logo: string;
  role: string;
}

const UserInfo: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axiosInstance.get<{ status: string; data: UserData }>('api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setUserData(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return <div>Loading user information...</div>;
  }

  return (
    <div>
      <h2>User Information</h2>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Country: {userData.country}</p>
    </div>
  );
};

export default UserInfo;
