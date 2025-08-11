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

import GoogleTranslate from './services/GoogleTranslate';
import SingleVenueDetailsPage from './pages/SingleVenueDetailsPage'
import VenueBookingPage from './pages/VenueBookingPage'
import { useAuth } from './hooks/useAuth';
import SportsVenuesPage from './pages/SportsVenuesPage'
import UserProfile from './components/UserProfile';

// Inner component that uses the auth context
const AppContent = () => {
  const { user, showRoleModal, closeRoleModal } = useAuth();

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 ease-in-out font-inter">
        <GoogleTranslate />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/venues"
              element={
                <ProtectedRoute requireAuth={true}>
                  <SportsVenuesPage />
                </ProtectedRoute>
              }
            />  
            <Route 
              path="/venue/:venueId" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <SingleVenueDetailsPage />
                </ProtectedRoute>
              }
              />
              <Route path='/venue/:venueId/booking' element={
                <ProtectedRoute requireAuth={true}>
                  <VenueBookingPage />
                </ProtectedRoute>
              } />
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
              path="/verify-otp" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <OTPVerificationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPasswordPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <ResetPasswordPage />
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
        
        {/* Role Selection Modal for Google login users */}
        <RoleSelectionModal 
          isOpen={showRoleModal}
          user={user}
          onComplete={closeRoleModal}
        />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;