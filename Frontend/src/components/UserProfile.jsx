import React, { useState } from 'react';
import { User, MapPin, Calendar, Clock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from './Navbar';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('editProfile');
  
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
    <div className="min-h-screen bg-gray-50 pt-16">
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
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
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
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Edit Profile</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="lg:col-span-1 flex justify-center items-center order-1 lg:order-1">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-4 lg:col-span-1 order-2 lg:order-2">
                  {/* Editable Full Name Field */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={editableProfileData.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {/* Editable Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={editableProfileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  {/* Old Password Field */}
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Old Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        id="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                        placeholder="Enter your old password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
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
                        placeholder="Enter your new password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
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
              
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-6 justify-center"> {/* Centered buttons */}
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Save
                </button>
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