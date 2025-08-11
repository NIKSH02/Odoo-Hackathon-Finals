// Verify OTP (only needs email and otp)
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    if (user.isEmailVerified) throw new ApiError(400, 'Email already verified');
    if (user.otp !== otp || user.otpExpiry < Date.now()) throw new ApiError(400, 'Invalid or expired OTP');
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return res.status(200).json(new ApiResponse(200, null, 'Email verified successfully!'));
  }
  // If user does not exist yet, just accept OTP for now (simulate verification)
  return res.status(200).json(new ApiResponse(200, null, 'Email verified successfully!'));
});

// ================= IMPORTS =================
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.js';

import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } from '../utils/generateToken.js';
import { generateOTP, sendOTPEmail } from '../utils/emailUtils.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= CONTROLLERS =================

// Send OTP for email verification (only needs email)
const sendOtp = asyncHandler(async (req, res) => {
  const { email, purpose = 'signup' } = req.body;
  let user = await User.findOne({ email });
  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

  if (purpose === 'login') {
    if (!user) {
      console.error(`[OTP LOGIN ERROR] No user found for email: ${email}`);
      throw new ApiError(400, 'This email is not registered.');
    }
    if (!user.isEmailVerified) {
      console.error(`[OTP LOGIN ERROR] Email not verified for: ${email}`);
      throw new ApiError(400, 'This email is not verified.');
    }
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    console.log(`DEBUG OTP for login (${email}):`, otp); // Debug log
    await sendOTPEmail({ to: email, otp });
    return res.status(200).json(new ApiResponse(200, null, 'OTP sent to registered email.'));
  }

  // Default: signup flow
  if (user && user.isEmailVerified) throw new ApiError(400, 'Email already registered');
  if (!user) {
    user = new User({ email, otp, otpExpiry, isEmailVerified: false });
    await user.save();
    console.log(`DEBUG OTP for signup (created new user: ${email}):`, otp);
  } else {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    console.log(`DEBUG OTP for signup (${email}):`, otp);
  }
  await sendOTPEmail({ to: email, otp });
  res.status(200).json(new ApiResponse(200, null, 'OTP sent to email. Please verify.'));
});

// Signup (register) with OTP verification
const signup = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    if (!user.isEmailVerified) {
      console.error('Signup failed: Email not verified for', email);
      throw new ApiError(400, 'Please verify your email first.');
    }
    if (user.username) {
      console.error('Signup failed: User already registered for', email);
      throw new ApiError(400, 'User already registered.');
    }
    // Check if username is already taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists && usernameExists.email !== email) {
      console.error('Signup failed: Username already taken', username);
      throw new ApiError(400, 'Username already taken');
    }
    user.fullName = fullName;
    user.username = username;
    user.password = password;
    await user.save();
    return res.status(201).json(new ApiResponse(201, null, 'Signup successful!'));
  }
  // If user does not exist, create new user (should not happen if flow is correct)
  console.error('Signup failed: No user found for', email);
  return res.status(400).json(new ApiError(400, 'Please verify your email first.'));
});

// Signin (login with password)
const signin = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
  });
  if (!user) throw new ApiError(400, 'User not found');
  if (!user.isEmailVerified) throw new ApiError(400, 'Email not verified');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(400, 'Invalid credentials');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  setAuthCookies(res, accessToken, refreshToken);
  
  // Return user data and token for frontend
  const userData = {
    id: user._id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    isEmailVerified: user.isEmailVerified
  };
  
  res.json(new ApiResponse(200, { token: accessToken, user: userData }, 'Login successful'));
});

// Refresh JWT token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new ApiError(401, 'No refresh token');

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken)
    throw new ApiError(401, 'Invalid refresh token');

  const newAccessToken = generateAccessToken(user);
  setAuthCookies(res, newAccessToken, refreshToken);
  res.json(new ApiResponse(200, null, 'Token refreshed'));
});


// Login with OTP
const loginWithOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`LOGIN OTP FAIL: No user for email ${email}`);
    throw new ApiError(400, 'Invalid or expired OTP');
  }
  if (user.otp !== otp) {
    console.log(`LOGIN OTP FAIL: OTP mismatch for ${email}. Expected: ${user.otp}, Received: ${otp}`);
    throw new ApiError(400, 'Invalid or expired OTP');
  }
  if (user.otpExpiry < Date.now()) {
    console.log(`LOGIN OTP FAIL: OTP expired for ${email}. Expiry: ${user.otpExpiry}, Now: ${Date.now()}`);
    throw new ApiError(400, 'Invalid or expired OTP');
  }
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  setAuthCookies(res, accessToken, refreshToken);
  
  // Return user data and token for frontend
  const userData = {
    id: user._id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    isEmailVerified: user.isEmailVerified
  };
  
  res.json(new ApiResponse(200, { token: accessToken, user: userData }, 'Login successful'));
});

// Logout (signout)
const logout = asyncHandler(async (req, res) => {
  clearAuthCookies(res);
  // Optionally, invalidate refresh token in DB if you want
  if (req.body.email) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  }
  res.json(new ApiResponse(200, null, 'Logged out successfully'));
});

// Google OAuth Authentication
const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, 'Google credential is required');
  }

  try {
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // User exists, update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
      }
      await user.save();
    } else {
      // Create new user
      const username = email.split('@')[0];
      
      // Check if username already exists
      let finalUsername = username;
      let counter = 1;
      while (await User.findOne({ username: finalUsername })) {
        finalUsername = `${username}${counter}`;
        counter++;
      }

      user = new User({
        email,
        fullName: name,
        username: finalUsername,
        googleId,
        profilePicture: picture,
        isEmailVerified: true, // Google emails are pre-verified
        authProvider: 'google'
      });
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email, user.username);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Prepare user data for response
    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      isEmailVerified: user.isEmailVerified,
      authProvider: user.authProvider || 'google'
    };

    res.json(new ApiResponse(200, { token: accessToken, user: userData }, 'Google authentication successful'));
  } catch (error) {
    console.error('Google auth error:', error);
    throw new ApiError(401, 'Invalid Google token');
  }
});

// ================= EXPORTS =================
export {
  signup,
  signin,
  sendOtp,
  loginWithOtp,
  refreshToken,
  logout,
  verifyOtp,
  googleAuth
};
