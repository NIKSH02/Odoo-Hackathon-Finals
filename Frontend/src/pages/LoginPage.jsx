import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { signinService, sendOtpService, loginWithOtpService, googleAuthService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showSuccess, showError, showLoading, dismissToast } = useToast();
  
  const [loginMethod, setLoginMethod] = useState('password');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpSection, setShowOtpSection] = useState(false);
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

  const handleLoginWithPassword = async () => {
    if (!usernameOrEmail || !password) {
      showError('Please enter username/email and password.');
      return;
    }
    
    const loadingToast = showLoading('Logging in...');
    
    try {
      const response = await signinService({ usernameOrEmail, password });
      
      // Extract token and user data from response
      let token, user;
      
      if (response.data) {
        // Check different possible response formats
        token = response.data.token || response.data.accessToken || response.data.authToken;
        user = response.data.user || response.data.userData;
        
        // If no structured token, but response exists, use the response itself as token temporarily
        if (!token && response.data.message === 'Login successful') {
          token = 'temp_token_' + Date.now(); // Temporary token until backend provides proper JWT
          user = {
            id: 'user',
            email: usernameOrEmail.includes('@') ? usernameOrEmail : 'user@example.com',
            username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
            fullName: 'User',
          };
        }
      }
      
      dismissToast(loadingToast);
      
      if (token) {
        const loginSuccess = await login(token, user);
        if (loginSuccess) {
          showSuccess('Login successful! Redirecting...');
          const from = location.state?.from?.pathname || '/dashboard';
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        } else {
          showError('Login failed. Please try again.');
        }
      } else {
        showError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      dismissToast(loadingToast);
      showError(err.response?.data?.message || 'Login failed.');
    }
  };

  const handleSendOtpLogin = async () => {
    if (!email) {
      showError('Please enter your email.');
      return;
    }
    
    const loadingToast = showLoading('Sending OTP to your email...');
    
    try {
      await sendOtpService({ email, purpose: 'login' });
      dismissToast(loadingToast);
      setShowOtpSection(true);
      setOtpTimer(60);
      setCanResendOtp(false);
      showSuccess('OTP sent to your email. Please check your inbox.');
    } catch (err) {
      dismissToast(loadingToast);
      const backendMsg = err.response?.data?.message || 'Failed to send OTP.';
      console.error('OTP Login Error:', backendMsg, err);
      
      if (
        backendMsg.includes('not registered') ||
        backendMsg.includes('not verified')
      ) {
        showError(
          backendMsg + ' If you are a new user, please sign up first.'
        );
      } else {
        showError(backendMsg);
      }
    }
  };

  const handleResendOtpLogin = async () => {
    const loadingToast = showLoading('Resending OTP...');
    setOtpTimer(60);
    setCanResendOtp(false);
    
    try {
      await sendOtpService({ email, purpose: 'login' });
      dismissToast(loadingToast);
      showSuccess('OTP resent. Please check your inbox.');
    } catch (err) {
      dismissToast(loadingToast);
      showError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

    const handleLoginWithOtp = async () => {
    if (!email || !otp) {
      showError('Please enter email and OTP.');
      return;
    }
    
    const loadingToast = showLoading('Verifying OTP and logging in...');
    
    try {
      const response = await loginWithOtpService({ email, otp });
      
      // Extract token and user data from response
      let token, user;
      
      if (response.data) {
        // Check different possible response formats
        token = response.data.token || response.data.accessToken || response.data.authToken;
        user = response.data.user || response.data.userData;
        
        // If no structured token, but response exists, use the response itself as token temporarily
        if (!token && response.data.message === 'Login successful') {
          token = 'temp_token_' + Date.now(); // Temporary token until backend provides proper JWT
          user = {
            id: 'user',
            email: email,
            username: email.split('@')[0],
            fullName: 'User',
          };
        }
      }
      
      dismissToast(loadingToast);
      
      if (token) {
        const loginSuccess = await login(token, user);
        if (loginSuccess) {
          showSuccess('Login successful! Redirecting...');
          const from = location.state?.from?.pathname || '/dashboard';
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        } else {
          showError('Login failed. Please try again.');
        }
      } else {
        showError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      dismissToast(loadingToast);
      showError(err.response?.data?.message || 'Invalid OTP or login failed.');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const loadingToast = showLoading('Signing in with Google...');
    
    try {
      // Send the Google credential to your backend
      const response = await googleAuthService(credentialResponse.credential);
      
      dismissToast(loadingToast);
      
      if (response.data && response.data.data) {
        const { token, user } = response.data.data;
        
        const loginSuccess = await login(token, user);
        if (loginSuccess) {
          showSuccess('Google sign-in successful! Redirecting...');
          const from = location.state?.from?.pathname || '/dashboard';
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        } else {
          showError('Google sign-in failed. Please try again.');
        }
      } else {
        showError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      dismissToast(loadingToast);
      console.error('Google login error:', err);
      showError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleGoogleLoginError = () => {
    showError('Google sign-in was cancelled or failed.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Your App</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login Method Toggle */}
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('password');
                setShowOtpSection(false);
                setOtp('');
                setOtpTimer(0);
                setCanResendOtp(false);
              }}
              className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-l-md border ${
                loginMethod === 'password'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setPassword('');
              }}
              className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-r-md border border-l-0 ${
                loginMethod === 'otp'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              OTP
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {loginMethod === 'password' ? (
              <>
                <div>
                  <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username or Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="usernameOrEmail"
                      name="usernameOrEmail"
                      type="text"
                      required
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter your username or email"
                    />
                  </div>
                </div>

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
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleLoginWithPassword}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign In
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="mt-1 flex">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter your email"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtpLogin}
                      disabled={!email || showOtpSection}
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {showOtpSection ? 'Sent' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {showOtpSection && (
                  <>
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
                      <div className="mt-2 text-center">
                        {otpTimer > 0 ? (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Resend OTP in {otpTimer} seconds
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtpLogin}
                            disabled={!canResendOtp}
                            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={handleLoginWithOtp}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Sign In with OTP
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
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

          {/* Google Sign-In Button */}
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleLoginError}
              theme="outline"
              size="large"
              text="signin_with"
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

export default LoginPage;
