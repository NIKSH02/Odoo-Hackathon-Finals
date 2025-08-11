import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const LandingPage = () => {
  const navigate = useNavigate();

  const handleOpenSignUpModal = () => {
    navigate('/register');
  };
  
  const handleOpenLoginModal = () => {
    navigate('/login');
  };


  return (
    <>
     <Navbar onOpenSignUpModal={handleOpenSignUpModal} onOpenLoginModal={handleOpenLoginModal} />
      <HeroSection
        onOpenSignUpModal={handleOpenSignUpModal}
        onOpenLoginModal={handleOpenLoginModal}
      />
      <section className="features-section container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Our Core Features</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover the powerful capabilities that make our product stand out.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300 cursor-pointer hover:scale-105" onClick={() => navigate('/chat')}> 
            <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2">
              <span>AI Chat</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </h3>
            <p className="text-gray-700 dark:text-gray-300">Chat with our AI assistant for instant help, ideas, and more.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Feature Two</h3>
            <p className="text-gray-700 dark:text-gray-300">Detailed description of feature two, highlighting its benefits and impact.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Feature Three</h3>
            <p className="text-gray-700 dark:text-gray-300">Detailed description of feature three, highlighting its benefits and impact.</p>
          </div>
        </div>
      </section>
    
           <Footer />
    </>
  );
};

export default LandingPage;
