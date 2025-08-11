import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ChevronRight } from 'lucide-react';

// Single Venue Card
const VenueCard = ({ venue }) => (

    
  <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col p-4">
    {/* Image Placeholder */}
    <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center mb-4">
      <span className="text-gray-500">Image</span>
    </div>

    {/* Details */}
    <div className="flex-1 flex flex-col space-y-2">
      {/* Title */}
      <h3 className="font-semibold text-lg">{venue.sportType}</h3>

      {/* Location */}
      <div className="flex items-center gap-1 text-gray-600 text-sm">
        <MapPin className="w-4 h-4" />
        <span>{venue.location}</span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 text-sm">
        <Star className="w-4 h-4 fill-gray-800 text-gray-800" />
        <span className="font-medium">{venue.rating}</span>
        <span className="text-gray-500">({venue.reviewCount})</span>
      </div>

      {/* Price */}
      <div className="font-semibold text-black">
        ₹ {venue.price} per hour
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {venue.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Button */}
      <div className="mt-auto pt-3"
      >
        <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
          View Details
        </button>
      </div>
    </div>
  </div>
);

// Main Section
const VenueBookingSection = () => {
  const navigate = useNavigate();

  const venues = [
    {
      sportType: 'Badminton Court',
      location: 'Vaishali Circle, Ahmedabad',
      rating: '4.5',
      reviewCount: '125',
      price: '350',
      tags: ['Indoor', 'AC', 'Premium', 'Available']
    },
    {
      sportType: 'Badminton Court',
      location: 'Vaishali Circle, Ahmedabad',
      rating: '4.5',
      reviewCount: '125',
      price: '350',
      tags: ['Indoor', 'AC', 'Premium', 'Available']
    },
    {
      sportType: 'Badminton Court',
      location: 'Vaishali Circle, Ahmedabad',
      rating: '4.5',
      reviewCount: '125',
      price: '350',
      tags: ['Indoor', 'AC', 'Premium', 'Available']
    },
    {
      sportType: 'Badminton Court',
      location: 'Vaishali Circle, Ahmedabad',
      rating: '4.5',
      reviewCount: '125',
      price: '350',
      tags: ['Indoor', 'AC', 'Premium', 'Available']
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Book Venues</h2>
        <button
          onClick={() => navigate('/venues')}
          className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <span className="text-sm sm:text-base font-medium">See all venues</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {venues.map((venue, index) => (
          <VenueCard key={index} venue={venue} />
        ))}
      </div>
    </div>
  );
};

export default VenueBookingSection;
