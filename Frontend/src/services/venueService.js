import api from "../api/axiosInstance";

// Get all venues with pagination and filters
export const getAllVenuesService = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return api.get(`/venues${queryParams ? `?${queryParams}` : ""}`);
};

// Get venue by ID
export const getVenueByIdService = async (venueId) => {
  return api.get(`/venues/${venueId}`);
};

// Get venues by sport type
export const getVenuesBySportService = async (sportType, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return api.get(
    `/search/venues/sport/${sportType}${queryParams ? `?${queryParams}` : ""}`
  );
};

// Search venues by location
export const searchVenuesByLocationService = async (
  searchQuery,
  params = {}
) => {
  const queryParams = new URLSearchParams({
    ...params,
    q: searchQuery,
  }).toString();
  return api.get(`/search/venues?${queryParams}`);
};

// Get venue statistics (for owners)
export const getVenueStatsService = async (venueId) => {
  return api.get(`/venues/${venueId}/stats`);
};

// Create new venue (facility owners only)
export const createVenueService = async (venueData) => {
  if (venueData.photos && venueData.photos.length > 0) {
    const formData = new FormData();

    // Append non-file fields
    Object.keys(venueData).forEach((key) => {
      if (key === "photos") {
        // Handle photo uploads
        venueData.photos.forEach((photo, index) => {
          formData.append("photos", photo);
        });
      } else if (typeof venueData[key] === "object") {
        formData.append(key, JSON.stringify(venueData[key]));
      } else {
        formData.append(key, venueData[key]);
      }
    });

    return api.post("/venues", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    return api.post("/venues", venueData);
  }
};

// Update venue (owners only)
export const updateVenueService = async (venueId, updateData) => {
  if (
    updateData.photos &&
    updateData.photos.some((photo) => photo instanceof File)
  ) {
    const formData = new FormData();

    Object.keys(updateData).forEach((key) => {
      if (key === "photos") {
        updateData.photos.forEach((photo) => {
          if (photo instanceof File) {
            formData.append("photos", photo);
          }
        });
      } else if (typeof updateData[key] === "object") {
        formData.append(key, JSON.stringify(updateData[key]));
      } else {
        formData.append(key, updateData[key]);
      }
    });

    return api.put(`/venues/${venueId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    return api.put(`/venues/${venueId}`, updateData);
  }
};

// Delete venue (owners only)
export const deleteVenueService = async (venueId) => {
  return api.delete(`/venues/${venueId}`);
};

// Get venues owned by current user
export const getOwnerVenuesService = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return api.get(
    `/venues/owner/my-venues${queryParams ? `?${queryParams}` : ""}`
  );
};

// Toggle venue status (activate/deactivate)
export const toggleVenueStatusService = async (venueId) => {
  return api.patch(`/venues/${venueId}/toggle-status`);
};

// Get venues with advanced filters
export const getFilteredVenuesService = async (filters) => {
  return api.post("/search/venues/filter", filters);
};

// Get nearby venues
export const getNearbyVenuesService = async (
  latitude,
  longitude,
  radius = 10
) => {
  return api.get(
    `/search/venues/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
  );
};
