import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ThemeProvider from './context/ThemeContext';
import ToastProvider from './context/ToastContext';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelectionModal from './components/RoleSelectionModal';
import ScrollToTop from './components/ScrollToTop';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import UserProfile from './components/UserProfile';

import GoogleTranslate from './services/GoogleTranslate';
import { useAuth } from './hooks/useAuth';

// Inner component that uses the auth context
const AppContent = () => {
  const { user, showRoleModal, closeRoleModal } = useAuth();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <ToastProvider>

          <AuthProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 ease-in-out font-inter">
                <GoogleTranslate />
                <main>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route 
                    path="/login" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <LoginPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <RegisterPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <UserProfile />
                      </ProtectedRoute>
                    } 
                  />
                
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
