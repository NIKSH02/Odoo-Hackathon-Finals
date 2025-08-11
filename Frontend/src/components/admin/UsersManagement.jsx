import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getAllUsers, suspendUser, unsuspendUser, banUser, getUserBookingHistory } from '../../services/adminService';
import toast from 'react-hot-toast';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [users, setUsers] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await getAllUsers();
    setUsers(response.data?.users || []); // changed here - ensure we set an array, not the full object
    console.log('Fetched users:', response.data);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    toast.error('Failed to load users');
    setUsers(getDummyUsers());
  } finally {
    setLoading(false);
  }
};


  const fetchUserBookingHistory = async (userId) => {
    try {
      const response = await getUserBookingHistory(userId);
      setBookingHistory(response.data || []);
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
      toast.error('Failed to load booking history');
      // Fallback to dummy data
      setBookingHistory(getDummyBookingHistory(userId));
    }
  };

  // Dummy data fallback
  const getDummyUsers = () => [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'player', 
      status: 'active', 
      joinDate: '2024-01-15',
      phone: '+1-555-0101',
      totalBookings: 15,
      lastActivity: '2024-08-10'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'player', 
      status: 'active', 
      joinDate: '2024-02-20',
      phone: '+1-555-0102',
      totalBookings: 8,
      lastActivity: '2024-08-09'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      role: 'player', 
      status: 'banned', 
      joinDate: '2024-01-08',
      phone: '+1-555-0103',
      totalBookings: 3,
      lastActivity: '2024-07-15'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah@example.com', 
      role: 'player', 
      status: 'active', 
      joinDate: '2024-03-12',
      phone: '+1-555-0104',
      totalBookings: 22,
      lastActivity: '2024-08-11'
    },
    { 
      id: 5, 
      name: 'Alex Johnson', 
      email: 'alex@sportscomplex.com', 
      role: 'facility_owner', 
      status: 'active', 
      joinDate: '2024-01-10',
      phone: '+1-555-0201',
      totalFacilities: 3,
      businessName: 'Sports Complex Ltd',
      lastActivity: '2024-08-11'
    },
    { 
      id: 6, 
      name: 'Maria Garcia', 
      email: 'maria@elitesports.com', 
      role: 'facility_owner', 
      status: 'active', 
      joinDate: '2024-02-15',
      phone: '+1-555-0202',
      totalFacilities: 5,
      businessName: 'Elite Sports Center',
      lastActivity: '2024-08-10'
    },
    { 
      id: 7, 
      name: 'Robert Lee', 
      email: 'robert@cityrecreation.com', 
      role: 'facility_owner', 
      status: 'banned', 
      joinDate: '2024-03-20',
      phone: '+1-555-0203',
      totalFacilities: 2,
      businessName: 'City Recreation Hub',
      lastActivity: '2024-07-20'
    },
    { 
      id: 8, 
      name: 'David Brown', 
      email: 'david@example.com', 
      role: 'player', 
      status: 'inactive', 
      joinDate: '2024-02-28',
      phone: '+1-555-0105',
      totalBookings: 5,
      lastActivity: '2024-06-15'
    },
  ];

  const getDummyBookingHistory = (userId) => {
    const histories = {
      1: [
        { id: 101, venue: 'Sports Complex Ltd', court: 'Basketball Court 1', date: '2024-08-10', amount: 120, status: 'completed' },
        { id: 102, venue: 'Elite Sports Center', court: 'Tennis Court A', date: '2024-08-05', amount: 80, status: 'completed' },
        { id: 103, venue: 'Premier Sports Arena', court: 'Badminton Court', date: '2024-07-28', amount: 60, status: 'completed' },
      ],
      2: [
        { id: 201, venue: 'City Recreation Hub', court: 'Football Field', date: '2024-08-09', amount: 200, status: 'completed' },
        { id: 202, venue: 'Sports Complex Ltd', court: 'Basketball Court 2', date: '2024-08-01', amount: 120, status: 'cancelled' },
      ],
      4: [
        { id: 401, venue: 'Elite Sports Center', court: 'Tennis Court B', date: '2024-08-11', amount: 80, status: 'confirmed' },
        { id: 402, venue: 'Sports Complex Ltd', court: 'Basketball Court 1', date: '2024-08-08', amount: 120, status: 'completed' },
        { id: 403, venue: 'Premier Sports Arena', court: 'Swimming Pool', date: '2024-08-03', amount: 100, status: 'completed' },
      ],
    };
    return histories[userId] || [];
  };

  const filteredUsers = (users || []).filter(user => {
    const search = (searchTerm || '').toLowerCase();
    const matchesSearch = (user.name || '').toLowerCase().includes(search) ||
                         (user.email || '').toLowerCase().includes(search) ||
                         (user.businessName || '').toLowerCase().includes(search);

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleBanUser = async (userId) => {
    try {
      setActionLoading(true);
      await banUser(userId);
      toast.success('User banned successfully');
      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Failed to ban user:', error);
      toast.error('Failed to ban user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      setActionLoading(true);
      await unsuspendUser(userId);
      toast.success('User unbanned successfully');
      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Failed to unban user:', error);
      toast.error('Failed to unban user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      setActionLoading(true);
      await suspendUser(userId);
      toast.success('User suspended successfully');
      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Failed to suspend user:', error);
      toast.error('Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  };

  const viewBookingHistory = async (user) => {
    setSelectedUser(user);
    setShowBookingHistory(true);
    if (user.role === 'player') {
      await fetchUserBookingHistory(user.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-gray-100 text-black';
      case 'inactive':
        return 'bg-gray-200 text-gray-600';
      case 'banned':
        return 'bg-gray-300 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'player':
        return 'bg-gray-100 text-black';
      case 'facility_owner':
        return 'bg-black text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Users Management</h1>
        <p className="text-gray-600 mt-2">Manage all users including players and facility owners</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users, emails, or business names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="player">Players</option>
          <option value="facility_owner">Facility Owners</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-black">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.businessName && (
                          <div className="text-xs text-gray-400">{user.businessName}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleColor(user.role)}`}>
                        {user.role === 'facility_owner' ? 'Facility Owner' : user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">
                        {user.role === 'player' ? (
                          <span>{user.totalBookings} bookings</span>
                        ) : (
                          <span>{user.totalFacilities} facilities</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Last: {user.lastActivity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => viewBookingHistory(user)}
                          className="text-black hover:text-gray-600 flex items-center"
                          title="View Details"
                          disabled={actionLoading}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {user.status === 'banned' ? (
                          <button 
                            onClick={() => handleUnbanUser(user.id)}
                            className="text-gray-600 hover:text-black text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Loading...' : 'Unban'}
                          </button>
                        ) : user.status === 'active' ? (
                          <>
                            <button 
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-gray-600 hover:text-black text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              {actionLoading ? 'Loading...' : 'Suspend'}
                            </button>
                            <button 
                              onClick={() => handleBanUser(user.id)}
                              className="text-gray-600 hover:text-black text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
                              disabled={actionLoading}
                            >
                              {actionLoading ? 'Loading...' : 'Ban'}
                            </button>
                          </>
                        ) : user.status === 'inactive' ? (
                          <button 
                            onClick={() => handleBanUser(user.id)}
                            className="text-gray-600 hover:text-black text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Loading...' : 'Ban'}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showBookingHistory && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-black">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => setShowBookingHistory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black">User Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="text-black capitalize">
                        {selectedUser.role === 'facility_owner' ? 'Facility Owner' : selectedUser.role}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-black capitalize">{selectedUser.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-black">{selectedUser.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Join Date:</span>
                      <span className="text-black">{selectedUser.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Activity:</span>
                      <span className="text-black">{selectedUser.lastActivity}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black">Activity Summary</h3>
                  <div className="space-y-2">
                    {selectedUser.role === 'player' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Bookings:</span>
                          <span className="text-black">{selectedUser.totalBookings}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business Name:</span>
                          <span className="text-black">{selectedUser.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Facilities:</span>
                          <span className="text-black">{selectedUser.totalFacilities}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking History for Players */}
              {selectedUser.role === 'player' && bookingHistory.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Booking History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Court</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookingHistory.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-4 py-2 text-sm text-black">#{booking.id}</td>
                            <td className="px-4 py-2 text-sm text-black">{booking.venue}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{booking.court}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{booking.date}</td>
                            <td className="px-4 py-2 text-sm text-black">${booking.amount}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                booking.status === 'completed' ? 'bg-gray-100 text-black' :
                                booking.status === 'confirmed' ? 'bg-gray-200 text-gray-600' :
                                'bg-gray-300 text-gray-700'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* No booking history message */}
              {selectedUser.role === 'player' && bookingHistory.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No booking history available for this user.</p>
                </div>
              )}

              {/* Facility owner message */}
              {selectedUser.role === 'facility_owner' && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Facility owner details and venue management information would be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
