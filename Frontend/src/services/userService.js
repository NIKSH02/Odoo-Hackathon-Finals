import api from '../api/axiosInstance';

// Get current user details
export const getCurrentUserService = async () => {
  return api.get('/user/me');
};

// Update user profile
export const updateProfileService = async (data) => {
  return api.put('/user/profile', data);
};

// Get user by ID
export const getUserByIdService = async (userId) => {
  return api.get(`/user/${userId}`);
};

// Delete user account
export const deleteAccountService = async () => {
  return api.delete('/user/account');
};
