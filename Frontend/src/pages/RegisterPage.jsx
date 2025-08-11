import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { sendOtpService, verifyOtpService, signupService, googleAuthService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError, showLoading, dismissToast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  const otpTimerRef = useRef(null);

  useEffect(() => {
    if (otpTimer > 0) {
      otpTimerRef.current = setTimeout(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && showOtpSection) {
      setCanResendOtp(true);
    }
    return () => clearTimeout(otpTimerRef.current);
  }, [otpTimer, showOtpSection]);

  const validateForm = () => {
    if (!fullName || !username || !email || !password || !confirmPassword) {
      showError('Please fill in all fields.');
      return false;
    }
    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return false;
    }
    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleVerifyEmail = async () => {
    if (!email) {
      showError('Please enter your email to verify.');
      return;
    }
    
    const loadingToast = showLoading('Sending OTP to your email...');
    
    try {
      await sendOtpService({ email });
      dismissToast(loadingToast);
      setShowOtpSection(true);
      setOtpTimer(60);
      setCanResendOtp(false);
      showSuccess('OTP sent to your email. Please check your inbox.');
    } catch (err) {
      dismissToast(loadingToast);
      showError(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleResendOtp = async () => {
    const loadingToast = showLoading('Resending OTP...');
    setOtpTimer(60);
    setCanResendOtp(false);
    
    try {
      await sendOtpService({ email });
      dismissToast(loadingToast);
      showSuccess('OTP resent. Please check your inbox.');
    } catch (err) {
      dismissToast(loadingToast);
      showError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      showError('Please enter the OTP.');
      return;
    }
    
    const loadingToast = showLoading('Verifying OTP...');
    
    try {
      await verifyOtpService({ email, otp });
      dismissToast(loadingToast);
      showSuccess('Email verified successfully!');
      setIsEmailVerified(true);
      setShowOtpSection(false);
      return true;
    } catch (err) {
      dismissToast(loadingToast);
      showError(err.response?.data?.message || 'Invalid OTP.');
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!isEmailVerified) {
      showError('Please verify your email before signing up.');
      return;
    }
    
    const loadingToast = showLoading('Creating your account...');
    
    try {
      await signupService({ email, fullName, username, password });
      dismissToast(loadingToast);
      showSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      dismissToast(loadingToast);
      console.error('Signup error:', err.response?.data || err);
      showError(err.response?.data?.message || 'Signup failed.');
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    const loadingToast = showLoading('Creating account with Google...');
    
    try {
      // Send the Google credential to your backend
      const response = await googleAuthService(credentialResponse.credential);
      
      dismissToast(loadingToast);
      
      if (response.data && response.data.data) {
        const { token, user } = response.data.data;
        
        const loginSuccess = await login(token, user);
        if (loginSuccess) {
          showSuccess('Google sign-up successful! Redirecting...');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        } else {
          showError('Google sign-up failed. Please try again.');
        }
      } else {
        showError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      dismissToast(loadingToast);
      console.error('Google signup error:', err);
      showError(err.response?.data?.message || 'Google sign-up failed. Please try again.');
    }
  };

  const handleGoogleSignupError = () => {
    showError('Google sign-up was cancelled or failed.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Your App</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address {isEmailVerified && <span className="text-green-600 dark:text-green-400">✓ Verified</span>}
              </label>
              <div className="mt-1 flex">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEmailVerified}
                  className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:opacity-60"
                  placeholder="Enter your email"
                />
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={!email || showOtpSection || isEmailVerified}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEmailVerified ? 'Verified' : showOtpSection ? 'Sent' : 'Verify'}
                </button>
              </div>
            </div>

            {showOtpSection && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  OTP Code
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-center">
                    {otpTimer > 0 ? (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Resend OTP in {otpTimer} seconds
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResendOtp}
                        className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!otp}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isEmailVerified}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:opacity-60"
                  placeholder={isEmailVerified ? "Enter your password" : "Verify email first"}
                />
              </div>
              {!isEmailVerified && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Please verify your email before setting a password
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isEmailVerified}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:opacity-60"
                  placeholder={isEmailVerified ? "Confirm your password" : "Verify email first"}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSignUp}
                disabled={!isEmailVerified}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
              {!isEmailVerified && (
                <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                  Complete email verification to create your account
                </p>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Google Sign-Up Button */}
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={handleGoogleSignupError}
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
              logo_alignment="left"
              width={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
