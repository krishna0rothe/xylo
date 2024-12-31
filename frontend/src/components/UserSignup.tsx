import React from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
}

const initialState: UserFormData = {
  name: '',
  email: '',
  password: '',
  profilePicture: '',
};

const validationRules = {
  name: (value: string) => (!value ? 'Name is required' : undefined),
  email: (value: string) => (!value ? 'Email is required' : !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : undefined),
  password: (value: string) => (!value ? 'Password is required' : value.length < 6 ? 'Password must be at least 6 characters' : undefined),
  profilePicture: (value: string) => (!value ? 'Profile picture URL is required' : undefined),
};

export const UserSignup: React.FC = () => {
  const { formData, errors, handleChange, validateForm } = useFormValidation<UserFormData>(initialState, validationRules);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axiosInstance.post('/api/user/register', formData);
        console.log('Registration successful:', response.data);
        navigate('/login');
        // Handle successful registration (e.g., show success message, redirect)
      } catch (error) {
        console.error('Registration failed:', error);
        // Handle registration error (e.g., show error message)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-300">Profile Picture URL *</label>
        <input
          type="url"
          id="profilePicture"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        />
        {errors.profilePicture && <p className="mt-1 text-sm text-red-500">{errors.profilePicture}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign Up as User
      </button>
    </form>
  );
};

