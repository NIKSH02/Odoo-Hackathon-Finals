import axiosInstance from '../api/axiosInstance';

// Dashboard APIs
export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBookingActivity = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/booking-activity');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserRegistrationTrends = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/registration-trends');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMostActiveSports = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/active-sports');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getFacilityApprovalTrends = async (period = '30days') => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/facility-approval-trends', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRevenueData = async (period = '30days') => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/revenue', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User Management APIs
export const getAllUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const suspendUser = async (userId) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/suspend`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const unsuspendUser = async (userId) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/unsuspend`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const banUser = async (userId) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/ban`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserBookingHistory = async (userId) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}/bookings`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Facility Management APIs
export const getAllVenues = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/facilities', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPendingFacilities = async () => {
  try {
    const response = await axiosInstance.get('/admin/facilities/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getVenueDetails = async (venueId) => {
  try {
    const response = await axiosInstance.get(`/admin/facilities/${venueId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const approveFacility = async (venueId) => {
  try {
    const response = await axiosInstance.patch(`/admin/facilities/${venueId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const rejectFacility = async (venueId) => {
  try {
    const response = await axiosInstance.patch(`/admin/facilities/${venueId}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const suspendVenue = async (venueId) => {
  try {
    const response = await axiosInstance.patch(`/admin/facilities/${venueId}/suspend`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const reactivateVenue = async (venueId) => {
  try {
    const response = await axiosInstance.patch(`/admin/facilities/${venueId}/reactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const bulkVenueActions = async (actions) => {
  try {
    const response = await axiosInstance.post('/admin/facilities/bulk-actions', actions);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Reporting APIs
export const getComplianceReport = async () => {
  try {
    const response = await axiosInstance.get('/admin/reports/compliance');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Court Management APIs
export const getAllCourts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/courts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateCourtStatus = async (courtId, data) => {
  try {
    const response = await axiosInstance.patch(`/admin/courts/${courtId}/status`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCourtAnalytics = async (period = '30days') => {
  try {
    const response = await axiosInstance.get('/admin/courts/analytics', {
      params: { period }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
