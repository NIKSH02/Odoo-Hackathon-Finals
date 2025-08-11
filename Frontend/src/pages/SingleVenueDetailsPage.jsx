import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Clock, Star, Wifi, Car, AirVent, Shield, Droplets, Zap } from 'lucide-react';

// Header Component
const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">QUICKCOURT</div>
        <div className="flex items-center gap-4">
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
            📱 Book
          </button>
          <button className="text-gray-600 text-sm">
            🔒 Login / Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

// Image Carousel Component
const ImageCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
  ];
  
  return (
    <div>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64 md:h-80 lg:h-96 mb-4">
        <img 
          src={images[currentImage]} 
          alt={`Venue image ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-lg font-medium">
          {currentImage === 0 && "Main Court View"}
        </div>
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
          onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
          onClick={() => setCurrentImage(prev => (prev + 1) % images.length)}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Image Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
              currentImage === index ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img 
              src={image} 
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// Pricing Modal Component
const PricingModal = ({ sport, isOpen, onClose }) => {
  if (!isOpen) return null;

  const pricingData = {
    badminton: {
      name: "Badminton Standard Synthetic",
      schedule: [
        {
          days: "Monday - Friday",
          slots: [
            { time: "05:00 AM - 07:00 AM", price: "INR 500.0 / hour" },
            { time: "04:00 PM - 10:00 PM", price: "INR 500.0 / hour" }
          ]
        },
        {
          days: "Saturday - Sunday",
          slots: [
            { time: "05:00 AM - 10:00 PM", price: "INR 500.0 / hour" }
          ]
        },
        {
          days: "Holiday(s)",
          slots: [
            { time: "05:00 AM - 10:00 PM", price: "INR 500.0 / hour" }
          ]
        }
      ]
    },
    "table-tennis": {
      name: "Table Tennis Premium",
      schedule: [
        {
          days: "Monday - Friday",
          slots: [
            { time: "06:00 AM - 08:00 AM", price: "INR 300.0 / hour" },
            { time: "05:00 PM - 11:00 PM", price: "INR 350.0 / hour" }
          ]
        }
      ]
    },
    "box-cricket": {
      name: "Box Cricket Standard",
      schedule: [
        {
          days: "All Days",
          slots: [
            { time: "06:00 AM - 10:00 PM", price: "INR 800.0 / hour" }
          ]
        }
      ]
    }
  };

  const data = pricingData[sport] || pricingData.badminton;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold capitalize">{sport.replace('-', ' ')}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Pricing is subjected to change and is controlled by venue
          </p>
          
          <h4 className="font-semibold mb-4 underline">{data.name}</h4>
          
          <div className="space-y-4">
            {data.schedule.map((schedule, index) => (
              <div key={index}>
                <h5 className="font-medium mb-2">{schedule.days}</h5>
                {schedule.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex justify-between items-center mb-2">
                    <span className="text-sm">{slot.price}</span>
                    <span className="text-sm font-medium">{slot.time}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sports Available Component
const SportsAvailable = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  
  const sports = [
    { id: 'badminton', name: 'Badminton', icon: '🏸' },
    { id: 'table-tennis', name: 'Table Tennis', icon: '🔍' },
    { id: 'box-cricket', name: 'Box Cricket', icon: '⚾' }
  ];

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Sports Available</h3>
          <span className="text-sm text-gray-500">(Click on sport to view price chart)</span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className="bg-white border-2 border-gray-200 p-4 rounded-lg text-center hover:border-gray-300 hover:shadow-sm transition-all flex-shrink-0 min-w-[120px]"
            >
              <div className="text-2xl mb-2">{sport.icon}</div>
              <div className="font-medium text-sm">{sport.name}</div>
            </button>
          ))}
        </div>
      </div>

      <PricingModal 
        sport={selectedSport}
        isOpen={!!selectedSport}
        onClose={() => setSelectedSport(null)}
      />
    </>
  );
};

// Amenities Component
const Amenities = () => {
  const amenities = [
    { name: 'Parking', icon: Car, available: true },
    { name: 'Restroom', icon: Droplets, available: true },
    { name: 'Refreshments', icon: AirVent, available: true },
    { name: 'CCTV Surveillance', icon: Shield, available: true },
    { name: 'Centrally Air Conditioned Hall', icon: AirVent, available: true },
    { name: 'Seating Arrangement', icon: Car, available: true },
    { name: 'WIFI', icon: Wifi, available: true },
    { name: 'Library', icon: Zap, available: true }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Amenities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${amenity.available ? 'bg-green-500' : 'bg-red-500'}`}>
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-700">{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// About Venue Component
const AboutVenue = () => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">About Venue</h3>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <span className="font-medium">—</span>
          <span>Tournament Training Venue</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-medium">—</span>
          <span>Fee waiver than 15 players by 50 extra per person</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-medium">—</span>
          <span>Equipment available on rent</span>
        </div>
      </div>
    </div>
  );
};

// Reviews Component
const Reviews = () => {
  const reviews = [
    { name: "Mitchell Admin", rating: 5, comment: "Nice turf, well maintained", date: "9 June 2025, 5:30 PM" },
    { name: "Mitchell Admin", rating: 5, comment: "Nice turf, well maintained", date: "10 June 2025, 5:30 PM" },
    { name: "Mitchell Admin", rating: 5, comment: "Nice turf, well maintained", date: "10 June 2025, 5:30 PM" },
    { name: "Mitchell Admin", rating: 5, comment: "Nice turf, well maintained", date: "10 June 2025, 5:30 PM" },
    { name: "Mitchell Admin", rating: 5, comment: "Nice turf, well maintained", date: "10 June 2025, 5:30 PM" },
    { name: "Mitchell Admin", rating: 5, comment: "Nice turf, well maintained", date: "10 June 2025, 5:30 PM" }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Player Reviews & Ratings</h3>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="border rounded-lg p-4" style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  👤
                </div>
                <span className="font-medium text-sm">{review.name}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500">📅 {review.date}</span>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        ))}
        <button className="hover:bg-gray-700 text-white px-6 py-2 rounded-lg bg-black transition-colors font-medium text-sm">
          Load More Reviews
        </button>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500">
      Footer
    </footer>
  );
};

// Main Component
const SingleVenueDetailsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Venue Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">SBR Badminton</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>Satellite, Jodhpur Village</span>
            <div className="flex items-center gap-1 ml-4">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span>4.5 (6)</span>
            </div>
          </div>
        </div>

        {/* Image and Sidebar Section - 70/30 split */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Image Carousel - 70% width */}
          <div className="w-full lg:w-[70%]">
            <ImageCarousel />
          </div>

          {/* Sidebar - 30% width */}
          <div className="w-full lg:w-[30%] space-y-4">
            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors">
              📅 Book This Venue
            </button>
            
            <div className="border rounded-lg p-4 bg-white border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <Clock size={12} className="text-gray-600" />
                </div>
                <span className="font-medium">Operating Hours</span>
              </div>
              <p className="text-sm font-medium">7:00AM - 11:00PM</p>
            </div>

            <div className="border rounded-lg p-4 bg-white border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-red-500" />
                <span className="font-medium">Address</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                2nd Floor, Aangan Banquet Hall<br />
                Opp. Akruti Heights, Satellite,<br />
                Jodhpur Village, Ahmedabad, Gujarat<br />
                - 380051
              </p>
              
              <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm border-t border-gray-200 pt-3">
                Location Map
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Content Below */}
        <div className="w-full">
          <SportsAvailable />
          <Amenities />
          <AboutVenue />
          <Reviews />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SingleVenueDetailsPage;