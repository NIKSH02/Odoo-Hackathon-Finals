import React, { useState } from 'react';
import { User, MapPin, Calendar, Clock, CheckCircle, XCircle, Eye, EyeOff, Camera, Edit3 } from 'lucide-react';
import Navbar from './Navbar';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('editProfile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // State for editable profile data
  const [editableProfileData, setEditableProfileData] = useState({
    fullName: 'Mitchell Admin',
    email: 'mitchelladmin2817@gmail.com',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  // Password visibility toggles
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
  });

  // Sample booking data
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

  const handleProfileChange = (field, value) => {
    setEditableProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    // Implement save logic for profile and password here
    console.log('Saving profile data:', editableProfileData);
    console.log('Saving password data:', passwordData);
    
    // For now, just reset password fields after "save"
    setPasswordData({
      oldPassword: '',
      newPassword: '',
    });
    alert('Profile and password updated successfully!');
  };

  const handleReset = () => {
    // Reset password fields
    setPasswordData({
      oldPassword: '',
      newPassword: '',
    });
  };

  const handleCancelBooking = (bookingId) => {
    // Handle booking cancellation
    console.log('Cancelled booking:', bookingId);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 ">
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
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 truncate">{editableProfileData.fullName}</h3>
                <p className="text-gray-600 text-sm mt-1 truncate">{editableProfileData.email}</p>
                <p className="text-gray-500 text-xs mt-1">9999999999</p>
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
            
            {/* Sidebar Footer */}
         
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
                <button
                  onClick={toggleEditMode}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditMode ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Profile Image Section */}
                <div className="lg:col-span-1 flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-green-600" />
                      )}
                    </div>
                    <button
                      onClick={() => document.getElementById('mainImageUpload').click()}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                    <input
                      id="mainImageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-gray-900">{editableProfileData.fullName}</h3>
                    <p className="text-gray-500 text-sm">Click camera to upload photo</p>
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

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={editableProfileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          disabled={!isEditMode}
                          placeholder="Enter your email"
                          className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                            isEditMode 
                              ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white' 
                              : 'border-gray-200 bg-gray-50 text-gray-600'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  {isEditMode && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-green-600" />
                        Change Password
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Old Password Field */}
                        <div>
                          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.oldPassword ? "text" : "password"}
                              id="oldPassword"
                              value={passwordData.oldPassword}
                              onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                              placeholder="Enter current password"
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('oldPassword')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.oldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* New Password Field */}
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords.newPassword ? "text" : "password"}
                              id="newPassword"
                              value={passwordData.newPassword}
                              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                              placeholder="Enter new password"
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('newPassword')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.newPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              {isEditMode && (
                <div className="flex flex-col sm:flex-row gap-3 pt-8 justify-center border-t border-gray-200 mt-8">
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-300"
                  >
                    Reset Changes
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              )}
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