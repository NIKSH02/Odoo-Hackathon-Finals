import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- HeroSection Component ---
const HeroSection = ({ onOpenSignUpModal }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onOpenSignUpModal) {
      onOpenSignUpModal();
    } else {
      navigate('/register');
    }
  };

  const handleLearnMore = () => {
    // You can customize this to navigate to an about page or scroll to a features section
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-800 dark:to-gray-950 text-white dark:text-gray-100 py-20 md:py-32 transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Revolutionize Your Workflow with <span className="text-yellow-300 dark:text-indigo-400">Our Product</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90">
          Experience unparalleled efficiency and innovation. Our cutting-edge solution is designed to elevate your business to new heights.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleGetStarted}
            className="bg-white text-indigo-700 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Get Started Now
          </button>
          <button 
            onClick={handleLearnMore}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;

