import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleTranslate from '../services/GoogleTranslate';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { HiMoon, HiSun } from 'react-icons/hi2'; 
import { HiHome, HiInformationCircle, HiUserPlus } from 'react-icons/hi2';
import { HiLogin, HiLogout } from 'react-icons/hi';
// --- Navbar Component ---

const Navbar = ({ onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/register');
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  // Inline SVG Icons
  const HomeIcon = () => (
    <HiHome className="h-6 w-6" />
  );
  const InfoIcon = () => (
    <HiInformationCircle className="h-6 w-6" />
  );
  const UserPlusIcon = () => (
    <HiUserPlus className="h-6 w-6" />
  );
  const LogInIcon = () => (
    <HiLogin className="h-6 w-6" />
  );
  const LogOutIcon = () => (
    <HiLogout className="h-6 w-6" />
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" onClick={() => handleNavLinkClick('home')} className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          <span className="text-indigo-600 dark:text-indigo-400">Pro</span>duct
        </a>

        <div className="hidden md:flex space-x-8 items-center">
          <button onClick={() => handleNavLinkClick('home')} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
            <HomeIcon /> Home
          </button>
          <button onClick={() => handleNavLinkClick('about')} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
            <InfoIcon /> About Us
          </button>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.fullName || user?.username || user?.email}
              </span>
              <button onClick={handleLogout} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 font-medium">
                <LogOutIcon /> Logout
              </button>
            </div>
          ) : (
            <>
              <button onClick={handleSignUp} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
                <UserPlusIcon /> Sign Up
              </button>
              <button onClick={handleLogin} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium">
                <LogInIcon /> Login
              </button>
            </>
          )}
          <div className="ml-2 flex items-center">
            <GoogleTranslate />
          </div>

        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme !== 'dark' ? (
              <HiMoon className="h-6 w-6" />
            ) : (
              <HiSun className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        {/* Mobile Google Translate */}
        <div className="px-4 mt-2">
          <GoogleTranslate />
        </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 pb-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={() => handleNavLinkClick('home')} className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
            <HomeIcon /> Home
          </button>
          <button onClick={() => handleNavLinkClick('about')} className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
            <InfoIcon /> About Us
          </button>
          {isAuthenticated ? (
            <>
              <div className="px-4 py-3 text-gray-700 dark:text-gray-200 text-sm border-b border-gray-200 dark:border-gray-700">
                Welcome, {user?.fullName || user?.username || user?.email}
              </div>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-700 transition-colors duration-200 flex items-center">
                <LogInIcon /> Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSignUp} className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
                <UserPlusIcon /> Sign Up
              </button>
              <button onClick={handleLogin} className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center">
                <LogInIcon /> Login
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;