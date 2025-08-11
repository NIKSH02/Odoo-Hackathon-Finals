import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VenueBookingSection from '../components/VenueBookingSection';



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
      
     <VenueBookingSection />
    
           <Footer />
    </>
  );
};

export default LandingPage;
