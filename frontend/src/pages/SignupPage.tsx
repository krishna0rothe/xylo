import React, { useState } from 'react';
import { StudioSignup } from '../components/StudioSignup';
import { UserSignup } from '../components/UserSignup';
import { Toaster } from 'react-hot-toast';

export const SignupPage: React.FC = () => {
  const [isStudio, setIsStudio] = useState(false);

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-900 overflow-auto">
      <Toaster position="top-right" />
      <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Gaming-related background */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' /%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-50"></div>
        </div>

        {/* Content */}
        <div className="w-full max-w-md space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl relative z-10">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign Up for Xylo
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Create your Xylo account to start discovering, publishing, and collaborating on amazing games.
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsStudio(false)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                !isStudio ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setIsStudio(true)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isStudio ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Studio
            </button>
          </div>

          {isStudio ? <StudioSignup /> : <UserSignup />}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

