import User from '../models/user.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get current user details
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -refreshToken -otp -otpExpiry');
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'User details fetched successfully'));
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, username } = req.body;
  const userId = req.user.id;

  // Check if username is already taken by another user
  if (username) {
    const existingUser = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUser) {
      throw new ApiError(400, 'Username already taken');
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      ...(fullName && { fullName }),
      ...(username && { username })
    },
    { new: true, runValidators: true }
  ).select('-password -refreshToken -otp -otpExpiry');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

// Get user profile by ID (for admin or public profiles)
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId).select('-password -refreshToken -otp -otpExpiry -email');
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'User profile fetched successfully'));
});

// Delete user account
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const user = await User.findByIdAndDelete(userId);
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Account deleted successfully'));
});

export {
  getCurrentUser,
  updateProfile,
  getUserById,
  deleteAccount
};
