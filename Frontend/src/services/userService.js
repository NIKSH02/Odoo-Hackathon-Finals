import api from '../api/axiosInstance';

// Get current user details
export const getCurrentUserService = async () => {
  return api.get('/users/me');
};

// Update user profile
export const updateProfileService = async (data) => {
  return api.put('/users/profile', data);
};

// Get user by ID
export const getUserByIdService = async (userId) => {
  return api.get(`/users/${userId}`);
};

// Delete user account
export const deleteAccountService = async () => {
  return api.delete('/users/account');
};

// Update user role (for Google login users)
export const updateUserRoleService = async (data) => {
  return api.put('/users/role', data);
};
