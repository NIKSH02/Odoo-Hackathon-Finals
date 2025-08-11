
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 dark:text-gray-400 py-10 transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <a href="#" className="text-indigo-400 hover:text-indigo-300 mx-3">Privacy Policy</a>
          <span className="text-gray-600 dark:text-gray-700">|</span>
          <a href="#" className="text-indigo-400 hover:text-indigo-300 mx-3">Terms of Service</a>
          <span className="text-gray-600 dark:text-gray-700">|</span>
          <a href="#" className="text-indigo-400 hover:text-indigo-300 mx-3">Sitemap</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Product. All rights reserved.</p>
        <p className="text-sm mt-2">Designed with <span className="text-red-500">&hearts;</span> for the future.</p>
      </div>
    </footer>
  );
};

export default Footer;