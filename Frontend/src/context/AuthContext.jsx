import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContextProvider';
import { getCurrentUserService } from '../services/userService';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Check if token is valid
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      // For now, if it's not a JWT, we'll just check if it exists
      // Later you can enforce JWT format when your backend is updated
      if (token.includes('.')) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
      } else {
        // For non-JWT tokens, just check if they exist
        // This is temporary until backend is updated to use JWT
        return token.length > 0;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Fetch user details from backend
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await getCurrentUserService();
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      // Check if user needs to set role (Google login users)
      if (userData && (!userData.role || userData.role === null || userData.role === undefined)) {
        console.log('User needs role selection:', userData);
        setShowRoleModal(true);
      } else {
        console.log('User has role:', userData?.role);
        setShowRoleModal(false);
      }
      
      return userData;
    } catch (error) {
      console.error('Error fetching user details:', error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && isTokenValid(storedToken)) {
          setToken(storedToken);
          setIsAuthenticated(true);
          
          // Try to fetch fresh user data from backend
          const freshUserData = await fetchUserDetails();
          
          // If fetch fails, use stored user data as fallback
          if (!freshUserData && storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              logout();
            }
          }
        } else {
          // Token is invalid or expired, clear everything
          logout();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUserDetails]);

  // Login function
  const login = async (authToken, userData = null) => {
    try {
      if (!isTokenValid(authToken)) {
        throw new Error('Invalid token provided');
      }

      setToken(authToken);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', authToken);

      // If userData is provided, use it, otherwise fetch from backend
      if (userData) {
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        // Check if user needs to set role (Google login users)
        if (userData && (!userData.role || userData.role === null || userData.role === undefined)) {
          console.log('User needs role selection after login:', userData);
          setShowRoleModal(true);
        }
      } else {
        // Fetch fresh user data from backend
        await fetchUserDetails();
      }

      // Remove old localStorage key if it exists
      localStorage.removeItem('isLoggedIn');
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('isLoggedIn'); // Clean up old key
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
    
    // Check if role modal should be hidden after update
    if (userData && userData.role) {
      setShowRoleModal(false);
    }
  };

  // Close role modal
  const closeRoleModal = () => {
    setShowRoleModal(false);
  };

  // Get auth header for API requests
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    showRoleModal,
    login,
    logout,
    updateUser,
    closeRoleModal,
    getAuthHeader,
    isTokenValid,
    fetchUserDetails,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
