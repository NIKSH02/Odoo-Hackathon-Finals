// Verify OTP with only email and otp
export const verifyOtpService = async (data) => {
  return api.post('/auth/verify-otp', data);
};
import api from '../api/axiosInstance';


// Usage: Call sendOtpService({ email }) first, then signupService({ fullName, username, email, password, otp })
export const signupService = async (data) => {
  return api.post('/auth/signup', data);
};

export const signinService = async (data) => {
  return api.post('/auth/signin', data);
};

export const sendOtpService = async (data) => {
  return api.post('/auth/send-otp', data);
};

export const loginWithOtpService = async (data) => {
  return api.post('/auth/login-otp', data);
};

export const logoutService = async (data) => {
  return api.post('/auth/logout', data);
};

export const googleAuthService = async (credential) => {
  return api.post('/auth/google-auth', { credential });
};
