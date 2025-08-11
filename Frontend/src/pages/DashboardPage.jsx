import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import ProfileImage from '../components/ProfileImage';

const DashboardPage = () => {
  const { user, fetchUserDetails } = useAuth();

  // Fetch fresh user data when component mounts
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Dashboard
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Welcome back!
          </h2>
          <div className="flex items-start space-x-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <ProfileImage 
                src={user?.profilePicture}
                alt={`${user?.fullName || 'User'}'s profile`}
                size="w-24 h-24"
                fallbackText={user?.fullName?.charAt(0)?.toUpperCase() || '?'}
              />
            </div>
            
            {/* User Details */}
            <div className="flex-1 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Name:</strong> {user?.fullName || 'N/A'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Username:</strong> {user?.username || 'N/A'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> {user?.email || 'N/A'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Role:</strong> {user?.role ? (user.role === 'facility_owner' ? 'Facility Owner' : 'Player') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
