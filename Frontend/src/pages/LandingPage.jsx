import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VenueBookingSection from '../components/VenueBookingSection';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState(null);

  const handleOpenSignUpModal = () => {
    navigate('/register');
  };
  
  const handleOpenLoginModal = () => {
    navigate('/login');
  };

  // Handle location search from HeroSection
  const handleLocationSearch = (locationData) => {
    setSearchLocation(locationData);
  };

  return (
    <>
     <Navbar onOpenSignUpModal={handleOpenSignUpModal} onOpenLoginModal={handleOpenLoginModal} />
      <HeroSection
        onOpenSignUpModal={handleOpenSignUpModal}
        onOpenLoginModal={handleOpenLoginModal}
        onLocationSearch={handleLocationSearch}
      />
      
     <VenueBookingSection searchLocation={searchLocation} />
    
           <Footer />
    </>
  );
};

export default LandingPage;
