import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Search,
  ChevronDown,
  X,
  Filter,
  Menu,
} from "lucide-react";
import Navbar from "../components/Navbar";

const VenueCard = ({ venue, onViewDetails }) => {
  return (
    <div
      className="bg-white border border-gray-300 rounded-lg p-3 transition-all duration-300 relative group hover:shadow-xl hover:-translate-y-2 hover:border-black cursor-pointer"
      style={{
        width: "280px",
        height: "350px",
        minWidth: "280px",
        maxWidth: "280px",
        minHeight: "350px",
        maxHeight: "350px",
      }}
      onClick={() => onViewDetails(venue._id)}
    >
      {/* Venue Name Badge */}

      {/* Image Placeholder */}
      <div className="bg-gray-200 rounded-md h-28 flex items-center justify-center border border-gray-300 mb-3 mt-2 transition-all duration-300 group-hover:bg-gray-300 group-hover:border-gray-400">
        <span className="text-gray-600 text-sm group-hover:text-gray-700">
          Image
        </span>
      </div>

      {/* Venue Details - Fixed height container */}
      <div style={{ height: "200px" }} className="flex flex-col">
        {/* Sport Type */}
        <div style={{ height: "20px" }} className="flex items-center mb-2">
          <span className="text-sm font-semibold text-black truncate">
            {venue.sportType}
          </span>
        </div>

        {/* Location */}
        <div
          style={{ height: "20px" }}
          className="flex items-center gap-1 text-gray-700 mb-2"
        >
          <MapPin className="w-3 h-3 text-gray-600 flex-shrink-0" />
          <span className="text-xs truncate">{venue.location}</span>
        </div>

        {/* Price */}
        <div style={{ height: "20px" }} className="flex items-center mb-2">
          <span className="text-sm font-semibold text-black truncate">
            ₹ {venue.price} per hour
          </span>
        </div>

        {/* Rating */}
        <div
          style={{ height: "20px" }}
          className="flex items-center gap-1 mb-2"
        >
          <Star className="w-4 h-4 fill-gray-800 text-gray-800 flex-shrink-0" />
          <span className="text-sm font-semibold text-black">
            {venue.rating}
          </span>
          <span className="text-xs text-gray-500">({venue.reviewCount})</span>
        </div>

        {/* Tags */}
        <div
          style={{ height: "40px" }}
          className="flex flex-wrap gap-1 mb-3 overflow-hidden"
        >
          {venue.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700 border border-gray-300 h-fit transition-all duration-300 group-hover:bg-gray-300 group-hover:text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Details Button */}
        <div className="mt-auto">
          <button
            className="w-full bg-black text-white py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-300 hover:bg-gray-800 hover:shadow-lg transform hover:scale-105 group-hover:bg-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(venue._id);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileSidebar = ({ isOpen, onClose, filters, setFilters }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-gray-100 z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-300 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black">Filters</h3>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          <SidebarContent filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </>
  );
};

const SidebarContent = ({ filters, setFilters }) => {
  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      selectedRatings: prev.selectedRatings.includes(rating)
        ? prev.selectedRatings.filter((r) => r !== rating)
        : [...prev.selectedRatings, rating],
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedSport: "All Sport",
      priceRange: [0, 5500],
      venueType: "",
      selectedRatings: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Search by venue name */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Search by venue name
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for venue"
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
          />
        </div>
      </div>

      {/* Filter by sport type */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Filter by sport type
        </label>
        <div className="relative">
          <select
            value={filters.selectedSport}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, selectedSport: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
          >
            <option>All Sport</option>
            <option>Badminton</option>
            <option>Cricket</option>
            <option>Football</option>
            <option>Tennis</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Price range (per hour)
        </label>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">₹ 0.00</span>
          <span className="text-sm text-gray-600 ml-auto">₹ 5,500.00</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="5500"
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: [0, parseInt(e.target.value)],
              }))
            }
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider-black"
          />
        </div>
      </div>

      {/* Choose Venue Type */}
      <div>
        <label className="block text-sm font-semibold text-black mb-3">
          Choose Venue Type
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="venueType"
              value="indoor"
              checked={filters.venueType === "indoor"}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, venueType: e.target.value }))
              }
              className="w-4 h-4 text-black border-gray-300 focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">Indoor</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="venueType"
              value="outdoor"
              checked={filters.venueType === "outdoor"}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, venueType: e.target.value }))
              }
              className="w-4 h-4 text-black border-gray-300 focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-700">Outdoor</span>
          </label>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-black mb-3">
          <Star className="inline w-4 h-4 text-gray-600 mr-1" />
          Rating
        </label>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.selectedRatings.includes(stars)}
                onChange={() => handleRatingChange(stars)}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-700">{stars}+ stars</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
};

const SportsVenuesPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedSport: "All Sport",
    priceRange: [0, 5500],
    venueType: "",
    selectedRatings: [],
  });

  const handleViewVenueDetails = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  // Sample venue data - standardized for consistent card sizing
  const venues = [
    {
      id: 2,
      name: "Elite Club",
      sportType: "Badminton Court",
      location: "Vaishali Circle",
      price: "350",
      rating: "4.5",
      reviewCount: "125",
      tags: ["Indoor", "AC", "Premium", "Available"],
      type: "indoor",
    },
    {
      id: 3,
      name: "Victory Courts",
      sportType: "Badminton Court",
      location: "Vaishali Circle",
      price: "350",
      rating: "4.5",
      reviewCount: "125",
      tags: ["Indoor", "AC", "Premium", "Available"],
      type: "indoor",
    },
    {
      id: 4,
      name: "Champions Hub",
      sportType: "Badminton Court",
      location: "Vaishali Circle",
      price: "350",
      rating: "4.5",
      reviewCount: "125",
      tags: ["Indoor", "AC", "Premium", "Available"],
      type: "indoor",
    },
    {
      id: 5,
      name: "Pro Stadium",
      sportType: "Badminton Court",
      location: "Vaishali Circle",
      price: "350",
      rating: "4.5",
      reviewCount: "125",
      tags: ["Indoor", "AC", "Premium", "Available"],
      type: "indoor",
    },
    {
      id: 6,
      name: "Super Courts",
      sportType: "Badminton Court",
      location: "Vaishali Circle",
      price: "350",
      rating: "4.5",
      reviewCount: "125",
      tags: ["Indoor", "AC", "Premium", "Available"],
      type: "indoor",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-300 p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-5 h-5 text-black" />
          </button>
          <h1 className="text-lg font-bold text-black flex-1">
            Sports Venues in Ahmedabad: Discover and Book Nearby Venues
          </h1>
        </div>

        {/* Mobile Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search for venue"
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}

      <div className="flex">
        {/* Desktop Sidebar - Back to left side */}
        <div className="hidden lg:block w-80 bg-gray-100 border-r border-gray-300 p-6 h-screen sticky top-0 overflow-y-auto">
          <SidebarContent filters={filters} setFilters={setFilters} />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          filters={filters}
          setFilters={setFilters}
        />

        {/* Main Content with proper spacing */}
        <div className="flex-1 bg-white">
          <div className="hidden lg:block bg-white border-b border-gray-300 py-6">
            <div className="max-w-7xl mx-auto px-6">
              <h1 className="text-2xl font-bold text-black text-center">
                Sports Venues in Ahmedabad: Discover and Book Nearby Venues
              </h1>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Cards Grid with better spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onViewDetails={handleViewVenueDetails}
                />
              ))}
            </div>

            {/* Load More for mobile */}
            <div className="mt-8 text-center lg:hidden">
              <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsVenuesPage;
