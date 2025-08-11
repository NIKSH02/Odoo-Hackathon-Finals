import api from '../api/axiosInstance';

// Get current user details
export const getCurrentUserService = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user profile (with file upload support)
export const updateProfileService = async (profileData) => {
  try {
    const formData = new FormData();
    
    // Add text fields to formData
    if (profileData.fullName) formData.append('fullName', profileData.fullName);
    if (profileData.username) formData.append('username', profileData.username);
    if (profileData.role) formData.append('role', profileData.role);

    // Add profile picture if provided
    if (profileData.profilePicture && profileData.profilePicture instanceof File) {
      formData.append('profilePicture', profileData.profilePicture);
    }

    console.log('Sending profile update request with data:', Object.fromEntries(formData));
    
    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Profile update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error.response?.data || error;
  }
};

// Update profile picture only
export const updateProfilePictureService = async (profilePicture) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    const response = await api.put('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user by ID
export const getUserByIdService = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete user account
export const deleteAccountService = async () => {
  try {
    const response = await api.delete('/users/account');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user role (for Google login users)
export const updateUserRoleService = async (data) => {
  try {
    const response = await api.put('/users/role', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
