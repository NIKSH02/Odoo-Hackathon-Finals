import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, EyeIcon, PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getAllCourts, updateCourtStatus } from '../../services/adminService';
import toast from 'react-hot-toast';

const CourtsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [courts, setCourts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12
  });
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchCourts();
  }, [searchTerm, sportFilter, statusFilter, pagination.currentPage]);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: searchTerm || undefined,
        sport: sportFilter !== 'all' ? sportFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await getAllCourts(params);
      setCourts(response.data.courts || []);
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error('Failed to fetch courts:', error);
      toast.error('Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (courtId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [courtId]: true }));
      
      await updateCourtStatus(courtId, {
        isActive: newStatus === 'active',
        reason: `Court ${newStatus === 'active' ? 'activated' : 'deactivated'} by admin`
      });

      // Update the court in the local state
      setCourts(prev => prev.map(court => 
        court._id === courtId 
          ? { ...court, isActive: newStatus === 'active' }
          : court
      ));

      toast.success(`Court ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to update court status:', error);
      toast.error('Failed to update court status');
    } finally {
      setUpdating(prev => ({ ...prev, [courtId]: false }));
    }
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Courts Management</h1>
        <p className="text-gray-600 mt-2">Monitor and manage all sports courts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="all">All Sports</option>
          <option value="basketball">Basketball</option>
          <option value="tennis">Tennis</option>
          <option value="football">Football</option>
          <option value="badminton">Badminton</option>
          <option value="cricket">Cricket</option>
          <option value="volleyball">Volleyball</option>
          <option value="table_tennis">Table Tennis</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={fetchCourts}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading courts...</p>
        </div>
      )}

      {/* Stats Summary */}
      {!loading && courts.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-black">{pagination.totalCount}</p>
              <p className="text-sm text-gray-600">Total Courts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {courts.filter(court => court.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {courts.filter(court => !court.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Inactive</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(courts.reduce((sum, court) => sum + (court.pricePerHour || 0), 0) / courts.length) || 0}
              </p>
              <p className="text-sm text-gray-600">Avg. Price/Hour</p>
            </div>
          </div>
        </div>
      )}

      {/* Courts Grid */}
      {!loading && courts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No courts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div key={court._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Court Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-black">{court.name}</h3>
                  <p className="text-sm text-gray-600">{court.venue?.name || 'Unknown Venue'}</p>
                  <p className="text-xs text-gray-500">
                    Court #{court.courtNumber}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(court.isActive)}`}>
                  {court.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Court Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sport:</span>
                  <span className="text-sm font-medium text-black">{capitalizeFirst(court.sportType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="text-sm font-medium text-black">{court.capacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price/Hour:</span>
                  <span className="text-sm font-medium text-black">{formatPrice(court.pricePerHour)}</span>
                </div>
                {court.stats && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Bookings:</span>
                      <span className="text-sm font-medium text-black">{court.stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue:</span>
                      <span className="text-sm font-medium text-black">{formatPrice(court.stats.totalRevenue)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Features */}
              {court.features && court.features.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {court.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {capitalizeFirst(feature)}
                      </span>
                    ))}
                    {court.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{court.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-1"
                    title="Edit Court"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <button
                  onClick={() => handleStatusUpdate(court._id, court.isActive ? 'inactive' : 'active')}
                  disabled={updating[court._id]}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    court.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  } disabled:opacity-50`}
                >
                  {updating[court._id] ? '...' : court.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={!pagination.hasNextPage}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CourtsManagement;
