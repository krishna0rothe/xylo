import React from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface StudioFormData {
  name: string;
  email: string;
  password: string;
  country: string;
  website: string;
  bio: string;
  logo: string;
  twitter: string;
  facebook: string;
}

const initialState: StudioFormData = {
  name: '',
  email: '',
  password: '',
  country: '',
  website: '',
  bio: '',
  logo: '',
  twitter: '',
  facebook: '',
};

const validationRules = {
  name: (value: string) => (!value ? 'Name is required' : undefined),
  email: (value: string) => (!value ? 'Email is required' : !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : undefined),
  password: (value: string) => (!value ? 'Password is required' : value.length < 6 ? 'Password must be at least 6 characters' : undefined),
  country: (value: string) => (!value ? 'Country is required' : undefined),
  logo: (value: string) => (!value ? 'Logo URL is required' : undefined),
};

export const StudioSignup: React.FC = () => {
  const { formData, errors, handleChange, validateForm } = useFormValidation<StudioFormData>(initialState, validationRules);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axiosInstance.post('/api/studio/register', formData);
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
        <label htmlFor="country" className="block text-sm font-medium text-gray-300">Country *</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        >
          <option value="">Select a country</option>
          <option value="USA">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="Canada">Canada</option>
          {/* Add more countries as needed */}
        </select>
        {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        ></textarea>
      </div>

      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-300">Logo URL *</label>
        <input
          type="url"
          id="logo"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          required
        />
        {errors.logo && <p className="mt-1 text-sm text-red-500">{errors.logo}</p>}
      </div>

      <div>
        <label htmlFor="twitter" className="block text-sm font-medium text-gray-300">Twitter</label>
        <input
          type="url"
          id="twitter"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
      </div>

      <div>
        <label htmlFor="facebook" className="block text-sm font-medium text-gray-300">Facebook</label>
        <input
          type="url"
          id="facebook"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign Up as Studio
      </button>
    </form>
  );
};

