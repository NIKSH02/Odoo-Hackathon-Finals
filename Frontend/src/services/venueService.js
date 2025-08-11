import axiosInstance from '../api/axiosInstance';

const venueService = {
  // Get all venues with filters
  getAllVenues: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/venues', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get venue by ID
  getVenueById: async (venueId) => {
    try {
      const response = await axiosInstance.get(`/venues/${venueId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new venue (with photos)
  createVenue: async (venueData) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', venueData.name);
      formData.append('description', venueData.description);
      formData.append('address', JSON.stringify(venueData.address));
      formData.append('sportsSupported', JSON.stringify(venueData.sportsSupported));
      formData.append('amenities', JSON.stringify(venueData.amenities));
      formData.append('startingPrice', venueData.startingPrice);
      formData.append('operatingHours', JSON.stringify(venueData.operatingHours));

      // Add photos (max 4)
      if (venueData.photos && venueData.photos.length > 0) {
        venueData.photos.slice(0, 4).forEach((photo) => {
          formData.append('photos', photo);
        });
      }

      const response = await axiosInstance.post('/venues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update venue
  updateVenue: async (venueId, venueData) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (venueData.name) formData.append('name', venueData.name);
      if (venueData.description) formData.append('description', venueData.description);
      if (venueData.address) formData.append('address', JSON.stringify(venueData.address));
      if (venueData.sportsSupported) formData.append('sportsSupported', JSON.stringify(venueData.sportsSupported));
      if (venueData.amenities) formData.append('amenities', JSON.stringify(venueData.amenities));
      if (venueData.startingPrice) formData.append('startingPrice', venueData.startingPrice);
      if (venueData.operatingHours) formData.append('operatingHours', JSON.stringify(venueData.operatingHours));

      // Add new photos if any (max 4 total)
      if (venueData.newPhotos && venueData.newPhotos.length > 0) {
        venueData.newPhotos.slice(0, 4).forEach((photo) => {
          formData.append('photos', photo);
        });
      }

      const response = await axiosInstance.put(`/venues/${venueId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get owner's venues
  getOwnerVenues: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/venues/owner/my-venues', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete venue photo
  deleteVenuePhoto: async (venueId, photoIndex) => {
    try {
      const response = await axiosInstance.delete(`/venues/${venueId}/photos/${photoIndex}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle venue status
  toggleVenueStatus: async (venueId) => {
    try {
      const response = await axiosInstance.patch(`/venues/${venueId}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get popular venues
  getPopularVenues: async (limit = 8) => {
    try {
      const response = await axiosInstance.get('/venues/popular', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default venueService;
