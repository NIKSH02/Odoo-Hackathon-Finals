import React, { useState, useEffect, useCallback } from 'react';
import { processImageFile } from '../utils/imageUtils';
import { User, MapPin, Calendar, Clock, CheckCircle, XCircle, Camera, Edit3, Key } from 'lucide-react';
import Navbar from './Navbar';
import ProfileImage from './ProfileImage';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { getCurrentUserService, updateProfileService, updateProfilePictureService } from '../services/userService';
import { forgotPasswordService } from '../services/authService';

const UserProfile = () => {
  const { updateUser } = useAuth();
  const { showSuccess, showError, showLoading, dismissToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('editProfile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for user data
  const [userData, setUserData] = useState({
    fullName: '',
    username: '',
    email: '',
    role: '',
    profilePicture: null
  });

  // State for editable profile data
  const [editableProfileData, setEditableProfileData] = useState({
    fullName: '',
  });

  // Sample booking data - TODO: Replace with real API call
  const bookings = [
    {
      id: 1,
      facility: 'Skyline Badminton Court (Badminton)',
      date: '15 June 2024',
      time: '5:00 PM - 6:00 PM',
      location: 'Rajkot, Gujarat',
      status: 'Confirmed',
      isPastDate: false
    },
    {
      id: 2,
      facility: 'Skyline Badminton Court (Badminton)',
      date: '10 June 2024',
      time: '5:00 PM - 6:00 PM',
      location: 'Rajkot, Gujarat',
      status: 'Confirmed',
      isPastDate: true
    }
  ];

  // Fetch user data on component mount
  const fetchUserData = useCallback(async () => {
    try {
      const response = await getCurrentUserService();
      if (response.data && response.data.data) {
        const user = response.data.data;
        setUserData(user);
        setEditableProfileData({
          fullName: user.fullName || '',
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      showError('Failed to load user data');
    }
  }, [showError]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleProfileChange = (field, value) => {
    setEditableProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB.');
      return;
    }
    
    // Auto-upload the image
    setIsUploading(true);
    const loadingToast = showLoading('Processing and uploading profile picture...');

    try {
      // Process the image to remove EXIF data and correct orientation
      const processedFile = await processImageFile(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.9
      });

      const response = await updateProfilePictureService(processedFile);
      console.log('Profile picture update response:', response);
      
      if (response.data && response.data.data) {
        const updatedUser = response.data.data;
        console.log('Updated user data:', updatedUser);
        
        // Add cache busting timestamp to force image reload
        const profilePictureWithTimestamp = updatedUser.profilePicture + `?t=${Date.now()}`;
        
        setUserData(prev => ({ 
          ...prev, 
          profilePicture: profilePictureWithTimestamp 
        }));
        
        // Update auth context with original URL (without timestamp)
        updateUser({
          ...updatedUser,
          profilePicture: updatedUser.profilePicture
        });
        
        dismissToast(loadingToast);
        showSuccess('Profile picture updated successfully!');
      } else {
        console.error('Invalid response structure:', response);
        showError('Invalid response from server');
      }
    } catch (err) {
      dismissToast(loadingToast);
      if (err.message && err.message.includes('process')) {
        showError('Failed to process image. Please try a different image.');
      } else {
        showError('Failed to upload profile picture');
      }
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // Canceling edit mode - reset data
      setEditableProfileData({
        fullName: userData.fullName || '',
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    if (!editableProfileData.fullName.trim()) {
      showError('Full name is required.');
      return;
    }

    const loadingToast = showLoading('Updating profile...');

    try {
      const response = await updateProfileService({
        fullName: editableProfileData.fullName.trim()
      });
      
      if (response.data && response.data.data) {
        const updatedUser = response.data.data;
        setUserData(updatedUser);
        updateUser(updatedUser); // Update auth context
        setIsEditMode(false);
        dismissToast(loadingToast);
        showSuccess('Profile updated successfully!');
      }
    } catch (err) {
      dismissToast(loadingToast);
      if (err.response?.status === 400) {
        showError(err.response.data.message || 'Invalid input data');
      } else {
        showError('Failed to update profile');
      }
      console.error('Update error:', err);
    }
  };

  const handleChangePassword = async () => {
    if (!userData.email) {
      showError('Email not found. Please refresh the page.');
      return;
    }

    const loadingToast = showLoading('Sending password reset email...');

    try {
      await forgotPasswordService(userData.email);
      dismissToast(loadingToast);
      showSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      dismissToast(loadingToast);
      showError('Failed to send password reset email');
      console.error('Password reset error:', err);
    }
  };

  const handleCancelBooking = (bookingId) => {
    // TODO: Implement booking cancellation
    console.log('Cancelled booking:', bookingId);
    showSuccess('Booking cancelled successfully!');
  };

  const getRoleDisplayName = (role) => {
    if (role === 'facility_owner') return 'Facility Owner';
    if (role === 'player') return 'Player';
    return role || 'Not Set';
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Container for sidebar and content */}
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Responsive Layout */}
          <div className="w-full lg:w-80 bg-white shadow-lg border-r border-gray-200">
            {/* Mobile: Collapsed view with only buttons */}
            <div className="lg:hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('editProfile')}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm ${
                      activeTab === 'editProfile' 
                        ? 'bg-green-500 text-white font-semibold' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('allBookings')}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm ${
                      activeTab === 'allBookings' 
                        ? 'bg-green-500 text-white font-semibold' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Bookings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop: Full sidebar */}
            <div className="hidden lg:block h-[calc(100vh-4rem)]">
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4">
                    <ProfileImage 
                      src={userData.profilePicture}
                      alt={userData.fullName || 'Profile'}
                      size="w-24 h-24"
                      fallbackText={userData.fullName?.charAt(0)?.toUpperCase() || '?'}
                    />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 truncate">{userData.fullName || 'Loading...'}</h3>
                  <p className="text-gray-600 text-sm mt-1 truncate">{userData.email}</p>
                  <p className="text-gray-500 text-xs mt-1">@{userData.username}</p>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <div className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('editProfile')}
                    className={`w-full text-left px-4 py-4 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === 'editProfile' 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-semibold border-l-4 border-green-500 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-5 h-5 flex-shrink-0" />
                    <span>Edit Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('allBookings')}
                    className={`w-full text-left px-4 py-4 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === 'allBookings' 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-semibold border-l-4 border-green-500 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Calendar className="w-5 h-5 flex-shrink-0" />
                    <span>All Bookings</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area - Responsive */}
          <div className="flex-1 w-full">
            <div className="p-4 lg:p-6">
              {activeTab === 'editProfile' && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-6xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Profile</h2>
                      <p className="text-gray-600">Update your personal information and account settings</p>
                    </div>
                    <div className="flex gap-2">
                      {isEditMode && (
                        <button
                          onClick={toggleEditMode}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <span>Cancel</span>
                        </button>
                      )}
                      <button
                        onClick={isEditMode ? handleSave : toggleEditMode}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>{isEditMode ? 'Save Changes' : 'Edit Profile'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Profile Image Section */}
                    <div className="lg:col-span-1 flex flex-col items-center space-y-4">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <ProfileImage 
                            src={userData.profilePicture}
                            alt={userData.fullName || 'Profile'}
                            size="w-32 h-32"
                            fallbackText={userData.fullName?.charAt(0)?.toUpperCase() || '?'}
                          />
                        </div>
                        <button
                          onClick={() => document.getElementById('mainImageUpload').click()}
                          disabled={isUploading}
                          className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Camera className="w-5 h-5 text-white" />
                        </button>
                        <input
                          id="mainImageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg text-gray-900">{userData.fullName || 'Loading...'}</h3>
                        <p className="text-gray-500 text-sm">Click camera to upload photo</p>
                        {isUploading && (
                          <p className="text-green-600 text-sm mt-1">Uploading...</p>
                        )}
                      </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-green-600" />
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Full Name Field */}
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              value={editableProfileData.fullName}
                              onChange={(e) => handleProfileChange('fullName', e.target.value)}
                              disabled={!isEditMode}
                              placeholder="Enter your full name"
                              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                                isEditMode 
                                  ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white' 
                                  : 'border-gray-200 bg-gray-50 text-gray-600'
                              }`}
                            />
                          </div>

                          {/* Username Field - Read Only */}
                          <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                              Username
                            </label>
                            <input
                              type="text"
                              id="username"
                              value={userData.username || ''}
                              disabled
                              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
                            />
                          </div>

                          {/* Email Field - Read Only */}
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={userData.email || ''}
                              disabled
                              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
                            />
                          </div>

                          {/* Role Field - Read Only */}
                          <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <input
                              type="text"
                              id="role"
                              value={getRoleDisplayName(userData.role)}
                              disabled
                              className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password Section */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Key className="w-5 h-5 text-green-600" />
                          Password Management
                        </h4>
                        <div className="text-center">
                          <p className="text-gray-600 mb-4">
                            To change your password, we'll send you a secure reset link via email.
                          </p>
                          <button
                            onClick={handleChangePassword}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                          >
                            Send Password Reset Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'allBookings' && (
                <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6">All Bookings</h2>
                  
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">{booking.facility}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>{booking.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center">
                              {booking.status === 'Confirmed' ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                              )}
                              <span className={`text-sm font-medium ${
                                booking.status === 'Confirmed' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            
                            {!booking.isPastDate && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors w-full sm:w-auto"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      {bookings.filter(b => b.isPastDate).length > 0 && 
                        "Note: Cancel button is not available for past dates"
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;