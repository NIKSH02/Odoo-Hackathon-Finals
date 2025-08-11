import React, { useState, useEffect, useRef } from 'react';
import { signinService, sendOtpService, loginWithOtpService } from '../services/authService';

const LoginModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [loginMethod, setLoginMethod] = useState('password');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const otpTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setLoginMethod('password');
      setUsernameOrEmail('');
      setPassword('');
      setEmail('');
      setOtp('');
      setShowOtpSection(false);
      setOtpTimer(0);
      setCanResendOtp(false);
      setMessage('');
      setMessageType('');
      clearTimeout(otpTimerRef.current);
    }
  }, [isOpen]);

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
      setMessage('Please enter username/email and password.');
      setMessageType('error');
      return;
    }
    setMessage('Logging in with password...');
    setMessageType('success');
    try {
      await signinService({ usernameOrEmail, password });
      localStorage.setItem('isLoggedIn', 'true');
      window.dispatchEvent(new Event('storage'));
      setMessage('Login successful! Redirecting...');
      setMessageType('success');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
      setMessageType('error');
    }
  };

  const handleSendOtpLogin = async () => {
    if (!email) {
      setMessage('Please enter your email.');
      setMessageType('error');
      return;
    }
    setMessage('Sending OTP to your email...');
    setMessageType('success');
    try {
      await sendOtpService({ email, purpose: 'login' });
      setShowOtpSection(true);
      setOtpTimer(60);
      setCanResendOtp(false);
      setMessage('OTP sent to your email. Please check your inbox.');
      setMessageType('success');
    } catch (err) {
      const backendMsg = err.response?.data?.message || 'Failed to send OTP.';
      console.error('OTP Login Error:', backendMsg, err);
      // If backend says not registered or not verified, offer to sign up
      if (
        backendMsg.includes('not registered') ||
        backendMsg.includes('not verified')
      ) {
        setMessage(
          backendMsg + ' If you are a new user, please sign up first.'
        );
        setMessageType('error');
      } else {
        setMessage(backendMsg);
        setMessageType('error');
      }
    }
  };

  const handleResendOtpLogin = async () => {
    setMessage('Resending OTP...');
    setMessageType('success');
    setOtpTimer(60);
    setCanResendOtp(false);
    try {
      await sendOtpService({ email, purpose: 'login' });
      setMessage('OTP resent. Please check your inbox.');
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to resend OTP.');
      setMessageType('error');
    }
  };

  const handleOtpSubmitLogin = async () => {
    if (otp.length !== 6) {
      setMessage('Please enter a 6-digit OTP.');
      setMessageType('error');
      return;
    }
    try {
      await loginWithOtpService({ email, otp });
      localStorage.setItem('isLoggedIn', 'true');
      window.dispatchEvent(new Event('storage'));
      setMessage('Login successful via OTP! Redirecting...');
      setMessageType('success');
      clearTimeout(otpTimerRef.current);
      setOtpTimer(0);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setMessageType('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <div className="relative max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transform scale-100 opacity-100 transition-all duration-300 ease-in-out">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Log in to Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Choose your preferred login method.
          </p>
        </div>
        {message && (
          <div className={`p-3 rounded-md text-sm ${messageType === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
            {message}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => { setLoginMethod('password'); setMessage(''); setShowOtpSection(false); setOtp(''); setEmail(''); }}
            className={`px-6 py-3 rounded-l-lg font-medium text-sm transition-colors duration-200 ${
              loginMethod === 'password'
                ? 'bg-indigo-600 text-white dark:bg-indigo-700'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Login with Password
          </button>
          <button
            onClick={() => { setLoginMethod('email'); setMessage(''); setShowOtpSection(false); setOtp(''); setUsernameOrEmail(''); setPassword(''); }}
            className={`px-6 py-3 rounded-r-lg font-medium text-sm transition-colors duration-200 ${
              loginMethod === 'email'
                ? 'bg-indigo-600 text-white dark:bg-indigo-700'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Login with Email (OTP)
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          {loginMethod === 'password' ? (
            <>
              <div>
                <label htmlFor="username-or-email" className="sr-only">Username or Email</label>
                <input
                  id="username-or-email"
                  name="username-or-email"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                  placeholder="Username or Email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="sr-only">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  onClick={handleLoginWithPassword}
                  disabled={!usernameOrEmail || !password}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white mt-6 ${
                    (!usernameOrEmail || !password)
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600'
                  }`}
                >
                  Login
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex">
                <label htmlFor="login-email" className="sr-only">Email address</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg shadow-sm placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm flex-grow"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setShowOtpSection(false); setOtp(''); setMessage(''); }}
                />
                <button
                  type="button"
                  onClick={handleSendOtpLogin}
                  disabled={!email || showOtpSection}
                  className={`ml-2 px-4 py-2 rounded-r-lg font-medium text-sm transition-colors duration-200 ${
                    (!email || showOtpSection)
                      ? 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600'
                  }`}
                >
                  Send OTP
                </button>
              </div>
              {showOtpSection && (
                <div>
                  <label htmlFor="login-otp" className="sr-only">OTP</label>
                  <input
                    id="login-otp"
                    name="otp"
                    type="text"
                    maxLength="6"
                    required
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Time remaining: {otpTimer}s</span>
                    <button
                      type="button"
                      onClick={handleResendOtpLogin}
                      disabled={!canResendOtp}
                      className={`font-medium ${canResendOtp ? 'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
                    >
                      Resend OTP
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleOtpSubmitLogin}
                    className="mt-3 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </>
          )}
        </form>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button onClick={() => { onClose(); onSwitchToSignUp(); }} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

