import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const VenueCard = ({ venue }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 w-full sm:w-72 h-auto sm:h-96 flex flex-col min-w-[280px] sm:min-w-0">
      {/* Venue Name Badge */}
      <div className="relative mb-4">
       
        
        {/* Image Placeholder */}
        <div className="bg-gray-200 rounded-lg h-28 sm:h-32 flex items-center justify-center border border-gray-300">
          <span className="text-gray-600 text-sm">Image</span>
        </div>
      </div>

      {/* Venue Details */}
      <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
        {/* Sport Type */}
        <div className="flex items-center gap-2">
          <span className="text-black font-semibold text-sm sm:text-base">{venue.sportType}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-700">
          <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm truncate">{venue.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-gray-800 text-gray-800" />
          <span className="font-semibold text-black text-sm">{venue.rating}</span>
          <span className="text-gray-500 text-sm">({venue.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="text-black font-semibold text-sm">
          ₹ {venue.price} per hour
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 flex-1">
          {venue.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700 border border-gray-300 h-fit"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Details Button */}
        <div className="mt-auto pt-3">
          <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const VenueBookingSection = () => {
  const navigate = useNavigate();

  const handleSeeAllVenues = () => {
    navigate('/venues');
  };

  // Sample data - standardized content for all cards
  const venues = [
    {
      name: "Sports Arena Pro",
      sportType: "Badminton Court",
      location: "Vaishali Circle, Ahmedabad",
      rating: "4.5",
      reviewCount: "125",
      price: "350",
      tags: ["Indoor", "AC", "Premium", "Available"]
    },
    {
      name: "Elite Sports Club",
      sportType: "Badminton Court",
      location: "Vaishali Circle, Ahmedabad",
      rating: "4.5",
      reviewCount: "125",
      price: "350",
      tags: ["Indoor", "AC", "Premium", "Available"]
    },
    {
      name: "Victory Courts",
      sportType: "Badminton Court",
      location: "Vaishali Circle, Ahmedabad", 
      rating: "4.5",
      reviewCount: "125",
      price: "350",
      tags: ["Indoor", "AC", "Premium", "Available"]
    },
    {
      name: "Champions Arena",
      sportType: "Badminton Court",
      location: "Vaishali Circle, Ahmedabad",
      rating: "4.5", 
      reviewCount: "125",
      price: "350",
      tags: ["Indoor", "AC", "Premium", "Available"]
    }
  ];

  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">Book Venues</h2>
        <button 
          onClick={handleSeeAllVenues}
          className="text-gray-700 hover:text-black transition-colors flex items-center gap-1 border border-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 self-start sm:self-auto"
        >
          <span className="font-medium text-sm sm:text-base">See all venues</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Container */}
      <div className="relative">
        {/* Mobile: Stack cards vertically */}
        <div className="block sm:hidden space-y-4 m-8">
          {venues.slice(0, 3).map((venue, index) => (
            <VenueCard key={index} venue={venue} />
          ))}
          {venues.length > 3 && (
            <div className="text-center pt-4">
              <button 
                onClick={handleSeeAllVenues}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm"
              >
                View More Venues
              </button>
            </div>
          )}
        </div>

        {/* Desktop: Horizontal scroll */}
        <div className="hidden sm:block">
          <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {venues.map((venue, index) => (
              <VenueCard key={index} venue={venue} />
            ))}
          </div>

          {/* Navigation Buttons - Desktop only */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-black transition-all duration-200">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-black transition-all duration-200">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueBookingSection;