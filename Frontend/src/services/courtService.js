import axiosInstance from '../api/axiosInstance';

class CourtService {
  // Get courts by venue (public route)
  async getCourtsByVenue(venueId, params = {}) {
    try {
      const { sportType, isActive = true } = params;
      const queryParams = new URLSearchParams();
      
      if (sportType) queryParams.append('sportType', sportType);
      if (isActive !== undefined) queryParams.append('isActive', isActive);
      
      const url = `/api/courts/venue/${venueId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching courts by venue:', error);
      throw error;
    }
  }

  // Get sports with court counts for a venue (public route)
  async getSportsWithCourtCounts(venueId) {
    try {
      const response = await axiosInstance.get(`/api/courts/venue/${venueId}/sports`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sports with court counts:', error);
      throw error;
    }
  }

  // Get court availability by sport type (public route)
  async getCourtAvailabilityBySport(venueId, params) {
    try {
      const { sportType, date, startTime, endTime } = params;
      const queryParams = new URLSearchParams({
        sportType,
        date,
        startTime,
        endTime
      });
      
      const response = await axiosInstance.get(`/api/courts/venue/${venueId}/availability?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching court availability by sport:', error);
      throw error;
    }
  }

  // Get court by ID (public route)
  async getCourtById(courtId) {
    try {
      const response = await axiosInstance.get(`/api/courts/${courtId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching court by ID:', error);
      throw error;
    }
  }

  // Check court availability (public route)
  async checkCourtAvailability(courtId, params) {
    try {
      const { date, startTime, endTime } = params;
      const queryParams = new URLSearchParams({
        date,
        startTime,
        endTime
      });
      
      const response = await axiosInstance.get(`/api/courts/${courtId}/availability?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error checking court availability:', error);
      throw error;
    }
  }

  // Create new court (facility owner only)
  async createCourt(courtData) {
    try {
      // Transform frontend data to match backend model
      const transformedData = this.transformCourtDataForBackend(courtData);
      
      const response = await axiosInstance.post('/api/courts/', transformedData);
      return response.data;
    } catch (error) {
      console.error('Error creating court:', error);
      throw error;
    }
  }

  // Create multiple courts for a sport type (facility owner only)
  async createBulkCourts(courtData) {
    try {
      const transformedData = this.transformCourtDataForBackend(courtData);
      
      const response = await axiosInstance.post('/api/courts/bulk', transformedData);
      return response.data;
    } catch (error) {
      console.error('Error creating bulk courts:', error);
      throw error;
    }
  }

  // Update court (owner only)
  async updateCourt(courtId, courtData) {
    try {
      const transformedData = this.transformCourtDataForBackend(courtData);
      
      const response = await axiosInstance.put(`/api/courts/${courtId}`, transformedData);
      return response.data;
    } catch (error) {
      console.error('Error updating court:', error);
      throw error;
    }
  }

  // Delete court (owner only)
  async deleteCourt(courtId) {
    try {
      const response = await axiosInstance.delete(`/api/courts/${courtId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting court:', error);
      throw error;
    }
  }

  // Get courts by owner (facility owner only)
  async getOwnerCourts(params = {}) {
    try {
      const { page = 1, limit = 10, venueId, sportType, isActive } = params;
      const queryParams = new URLSearchParams({ page, limit });
      
      if (venueId) queryParams.append('venueId', venueId);
      if (sportType) queryParams.append('sportType', sportType);
      if (isActive !== undefined) queryParams.append('isActive', isActive);
      
      const response = await axiosInstance.get(`/api/courts/owner/my-courts?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching owner courts:', error);
      throw error;
    }
  }

  // Toggle court active status (owner only)
  async toggleCourtStatus(courtId) {
    try {
      const response = await axiosInstance.patch(`/api/courts/${courtId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling court status:', error);
      throw error;
    }
  }

  // Add blocked slot for maintenance (owner only)
  async addBlockedSlot(courtId, slotData) {
    try {
      const response = await axiosInstance.post(`/api/courts/${courtId}/blocked-slots`, slotData);
      return response.data;
    } catch (error) {
      console.error('Error adding blocked slot:', error);
      throw error;
    }
  }

  // Remove blocked slot (owner only)
  async removeBlockedSlot(courtId, slotId) {
    try {
      const response = await axiosInstance.delete(`/api/courts/${courtId}/blocked-slots/${slotId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing blocked slot:', error);
      throw error;
    }
  }

  // Book a specific court (player only)
  async bookCourt(courtId, bookingData) {
    try {
      const response = await axiosInstance.post(`/api/courts/${courtId}/book`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error booking court:', error);
      throw error;
    }
  }

  // Transform frontend court data to match backend model
  transformCourtDataForBackend(courtData) {
    const transformed = {
      name: courtData.name,
      venue: courtData.venue,
      sportType: courtData.sportType,
      pricePerHour: Number(courtData.pricePerHour),
      capacity: Number(courtData.capacity),
      dimensions: {
        length: Number(courtData.dimensions?.length) || undefined,
        width: Number(courtData.dimensions?.width) || undefined,
        unit: courtData.dimensions?.unit || 'meters'
      },
      features: this.transformFeatures(courtData.features || []),
      equipment: this.transformEquipment(courtData.equipment || []),
      operatingHours: this.transformOperatingHours(courtData.operatingHours)
    };

    // Add court number if provided (for updates)
    if (courtData.courtNumber) {
      transformed.courtNumber = Number(courtData.courtNumber);
    }

    // Add custom name if provided
    if (courtData.customName) {
      transformed.customName = courtData.customName;
    }

    // Remove undefined values
    Object.keys(transformed).forEach(key => {
      if (transformed[key] === undefined) {
        delete transformed[key];
      }
    });

    return transformed;
  }

  // Transform features to match backend enum
  transformFeatures(features) {
    const featureMapping = {
      'Air Conditioning': 'air_conditioned',
      'Lighting': 'floodlights',
      'Indoor': 'indoor',
      'Outdoor': 'outdoor',
      'Synthetic Turf': 'synthetic_turf',
      'Wooden Floor': 'wooden_floor',
      'Concrete': 'concrete'
    };

    return features.map(feature => featureMapping[feature] || feature.toLowerCase().replace(/\s+/g, '_'));
  }

  // Transform equipment for backend
  transformEquipment(equipment) {
    if (Array.isArray(equipment) && equipment.length > 0 && typeof equipment[0] === 'string') {
      // If equipment is array of strings, convert to backend format
      return equipment.map(item => ({
        name: item,
        available: true,
        rentPrice: 0
      }));
    }
    // If already in backend format, return as is
    return equipment;
  }

  // Transform operating hours to match backend format
  transformOperatingHours(operatingHours) {
    if (!operatingHours) return {};

    const transformed = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
      if (operatingHours[day]) {
        transformed[day] = {
          start: operatingHours[day].openTime || operatingHours[day].start || '06:00',
          end: operatingHours[day].closeTime || operatingHours[day].end || '22:00',
          isAvailable: operatingHours[day].isOpen !== undefined ? operatingHours[day].isOpen : operatingHours[day].isAvailable !== undefined ? operatingHours[day].isAvailable : true
        };
      }
    });

    return transformed;
  }

  // Transform backend court data for frontend
  transformCourtDataForFrontend(backendData) {
    if (!backendData) return null;

    return {
      _id: backendData._id,
      name: backendData.name,
      courtNumber: backendData.courtNumber,
      venue: backendData.venue,
      sportType: backendData.sportType,
      pricePerHour: backendData.pricePerHour,
      capacity: backendData.capacity,
      dimensions: {
        length: backendData.dimensions?.length || '',
        width: backendData.dimensions?.width || '',
        height: backendData.dimensions?.height || '',
        unit: backendData.dimensions?.unit || 'meters'
      },
      features: this.transformFeaturesFromBackend(backendData.features || []),
      equipment: this.transformEquipmentFromBackend(backendData.equipment || []),
      operatingHours: this.transformOperatingHoursFromBackend(backendData.operatingHours || {}),
      isActive: backendData.isActive,
      totalBookings: backendData.totalBookings || 0,
      totalRevenue: backendData.totalRevenue || 0,
      blockedSlots: backendData.blockedSlots || [],
      createdAt: backendData.createdAt,
      updatedAt: backendData.updatedAt
    };
  }

  // Transform features from backend enum to frontend display
  transformFeaturesFromBackend(features) {
    const featureMapping = {
      'air_conditioned': 'Air Conditioning',
      'floodlights': 'Lighting',
      'indoor': 'Indoor',
      'outdoor': 'Outdoor',
      'synthetic_turf': 'Synthetic Turf',
      'wooden_floor': 'Wooden Floor',
      'concrete': 'Concrete'
    };

    return features.map(feature => featureMapping[feature] || feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  }

  // Transform equipment from backend to frontend
  transformEquipmentFromBackend(equipment) {
    if (Array.isArray(equipment) && equipment.length > 0 && typeof equipment[0] === 'object') {
      // If equipment is array of objects, extract names
      return equipment.map(item => item.name);
    }
    // If already array of strings, return as is
    return equipment;
  }

  // Transform operating hours from backend to frontend format
  transformOperatingHoursFromBackend(operatingHours) {
    const transformed = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
      if (operatingHours[day]) {
        transformed[day] = {
          isOpen: operatingHours[day].isAvailable !== undefined ? operatingHours[day].isAvailable : true,
          openTime: operatingHours[day].start || '06:00',
          closeTime: operatingHours[day].end || '22:00'
        };
      } else {
        // Default values
        transformed[day] = {
          isOpen: true,
          openTime: '06:00',
          closeTime: '22:00'
        };
      }
    });

    return transformed;
  }

  // Get available sports enum for frontend
  getSportsOptions() {
    return [
      { value: 'badminton', label: 'Badminton' },
      { value: 'tennis', label: 'Tennis' },
      { value: 'football', label: 'Football' },
      { value: 'basketball', label: 'Basketball' },
      { value: 'cricket', label: 'Cricket' },
      { value: 'volleyball', label: 'Volleyball' },
      { value: 'table_tennis', label: 'Table Tennis' }
    ];
  }

  // Get available features enum for frontend
  getFeaturesOptions() {
    return [
      { value: 'indoor', label: 'Indoor' },
      { value: 'outdoor', label: 'Outdoor' },
      { value: 'air_conditioned', label: 'Air Conditioning' },
      { value: 'floodlights', label: 'Lighting' },
      { value: 'synthetic_turf', label: 'Synthetic Turf' },
      { value: 'wooden_floor', label: 'Wooden Floor' },
      { value: 'concrete', label: 'Concrete' }
    ];
  }
}

export default new CourtService();
