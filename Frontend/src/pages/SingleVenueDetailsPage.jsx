import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Clock, Star, Wifi, Car, AirVent, Shield, Droplets, Zap } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import SportsAvailable from '../components/SportsAvailable';
import VenueReviews from '../components/VenueReview';
import Amenities from '../components/Amenities';

// About Venue Component
const AboutVenue = () => {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">About This Venue</h3>
        <div className="w-8 h-1 bg-black rounded-full"></div>
      </div>
      
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Tournament Training Venue</h4>
              <p className="text-sm text-gray-600">Professional-grade facility for competitive training</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Group Discount Available</h4>
              <p className="text-sm text-gray-600">Fee waiver for groups of 15+ players, additional ₹50 per extra person</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Equipment Rental Service</h4>
              <p className="text-sm text-gray-600">Quality sports equipment available for rent on-site</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t-2 border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You for Visiting</h3>
          <div className="w-8 h-1 bg-black rounded-full mx-auto"></div>
        </div>
        <p className="text-gray-600 font-medium">© 2025 Sports Venue Booking Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Main Component
const SingleVenueDetailsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Venue Header */}
        <div className="mb-8">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">SBR Badminton</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin size={18} className="text-gray-700" />
                </div>
                <span className="font-medium">Satellite, Jodhpur Village</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Star size={18} className="fill-black text-black" />
                </div>
                <span className="font-bold text-gray-900">4.5</span>
                <span className="text-gray-500">(6 reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image and Sidebar Section - 70/30 split */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Image Carousel - 70% width */}
          <div className="w-full lg:w-[70%]">
            <ImageCarousel />
          </div>

          {/* Sidebar - 30% width */}
          <div className="w-full lg:w-[30%] space-y-6">
            <button className="w-full bg-black text-white py-4 px-6 rounded-2xl font-bold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
              📅 Book This Venue
            </button>
            
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Clock size={20} className="text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Operating Hours</h3>
                  <div className="w-6 h-0.5 bg-black rounded-full mt-1"></div>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900 bg-gray-50 p-3 rounded-xl">7:00 AM - 11:00 PM</p>
              <p className="text-sm text-gray-600 mt-2">Open all days</p>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <MapPin size={20} className="text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Venue Address</h3>
                  <div className="w-6 h-0.5 bg-black rounded-full mt-1"></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <p className="text-gray-700 leading-relaxed font-medium">
                  2nd Floor, Aangan Banquet Hall<br />
                  Opp. Akruti Heights, Satellite,<br />
                  Jodhpur Village, Ahmedabad, Gujarat<br />
                  <span className="font-bold">- 380051</span>
                </p>
              </div>
              
              <div className="bg-gray-100 h-40 rounded-xl flex items-center justify-center border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <div className="text-center">
                  <div className="p-3 bg-white rounded-lg mb-2 inline-block">
                    <MapPin size={24} className="text-gray-700" />
                  </div>
                  <p className="text-gray-600 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-500">Click to view location</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Content Below */}
        <div className="w-full space-y-8">
          <SportsAvailable />
          <Amenities />
          <AboutVenue />
          <VenueReviews />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SingleVenueDetailsPage;