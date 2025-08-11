import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Home,
  Building,
  Target,
  Users,
  FileText,
  Menu,
  X,
  Settings,
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';

const TimeSlotManagement = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar navigation items
  const sidebarItems = [
    { 
      id: 'dashboard',
      name: 'Dashboard', 
      icon: Home, 
      path: '/facility-owner-dashboard',
      current: false 
    },
    { 
      id: 'bookings',
      name: 'Booking Overview', 
      icon: Calendar, 
      path: '/booking-overview',
      current: false 
    },
    { 
      id: 'facilities',
      name: 'Facility Management', 
      icon: Building, 
      path: '/facility-management',
      current: false 
    },
    { 
      id: 'timeslots',
      name: 'Time Slot Management', 
      icon: Clock, 
      path: '/time-slot-management',
      current: true 
    },
    { 
      id: 'profile',
      name: 'Owner Profile', 
      icon: Users, 
      path: '/owner-profile',
      current: false 
    }
  ];

  // Sample courts data
  const courts = [
    { id: 1, name: 'Badminton Court 1', sport: 'Badminton', status: 'active' },
    { id: 2, name: 'Badminton Court 2', sport: 'Badminton', status: 'active' },
    { id: 3, name: 'Tennis Court 1', sport: 'Tennis', status: 'active' },
    { id: 4, name: 'Football Ground', sport: 'Football', status: 'maintenance' },
    { id: 5, name: 'Basketball Court', sport: 'Basketball', status: 'active' }
  ];

  // Sample time slots data
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, courtId: 1, courtName: 'Badminton Court 1', time: '06:00 - 08:00', status: 'available', price: 300 },
    { id: 2, courtId: 1, courtName: 'Badminton Court 1', time: '08:00 - 10:00', status: 'booked', price: 300, customer: 'John Doe' },
    { id: 3, courtId: 1, courtName: 'Badminton Court 1', time: '10:00 - 12:00', status: 'available', price: 400 },
    { id: 4, courtId: 1, courtName: 'Badminton Court 1', time: '12:00 - 14:00', status: 'blocked', price: 400, reason: 'Maintenance' },
    { id: 5, courtId: 2, courtName: 'Badminton Court 2', time: '06:00 - 08:00', status: 'available', price: 300 },
    { id: 6, courtId: 3, courtName: 'Tennis Court 1', time: '06:00 - 08:00', status: 'available', price: 500 },
    { id: 7, courtId: 3, courtName: 'Tennis Court 1', time: '08:00 - 10:00', status: 'booked', price: 500, customer: 'Jane Smith' },
    { id: 8, courtId: 5, courtName: 'Basketball Court', time: '18:00 - 20:00', status: 'available', price: 250 }
  ]);

  const [blockSlotData, setBlockSlotData] = useState({
    courtId: '',
    date: selectedDate,
    startTime: '',
    endTime: '',
    reason: '',
    recurring: false
  });

  // Filter time slots based on selected court and date
  const filteredTimeSlots = timeSlots.filter(slot => {
    if (selectedCourt !== 'all' && slot.courtId !== parseInt(selectedCourt)) {
      return false;
    }
    return true;
  });

  const handleBlockSlot = () => {
    const newBlockedSlot = {
      id: timeSlots.length + 1,
      courtId: parseInt(blockSlotData.courtId),
      courtName: courts.find(c => c.id === parseInt(blockSlotData.courtId))?.name || '',
      time: `${blockSlotData.startTime} - ${blockSlotData.endTime}`,
      status: 'blocked',
      price: 0,
      reason: blockSlotData.reason
    };

    setTimeSlots([...timeSlots, newBlockedSlot]);
    setShowBlockModal(false);
    setBlockSlotData({
      courtId: '',
      date: selectedDate,
      startTime: '',
      endTime: '',
      reason: '',
      recurring: false
    });
  };

  const handleUnblockSlot = (slotId) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === slotId ? { ...slot, status: 'available', reason: null } : slot
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Owner Portal</h2>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.current 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Time Slot Management</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBlockModal(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Block Time Slot</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="all">All Courts</option>
                  {courts.map(court => (
                    <option key={court.id} value={court.id}>{court.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Slots for {selectedDate}</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTimeSlots.map((slot) => (
                      <tr key={slot.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {slot.courtName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {slot.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(slot.status)}`}>
                            {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{slot.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.customer && (
                            <span>Booked by: {slot.customer}</span>
                          )}
                          {slot.reason && (
                            <span className="flex items-center text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              {slot.reason}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {slot.status === 'blocked' ? (
                            <button
                              onClick={() => handleUnblockSlot(slot.id)}
                              className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                            >
                              <RotateCcw className="h-4 w-4" />
                              <span>Unblock</span>
                            </button>
                          ) : slot.status === 'available' && (
                            <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Block Time Slot Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Block Time Slot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
                <select
                  value={blockSlotData.courtId}
                  onChange={(e) => setBlockSlotData({...blockSlotData, courtId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Select Court</option>
                  {courts.map(court => (
                    <option key={court.id} value={court.id}>{court.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={blockSlotData.date}
                  onChange={(e) => setBlockSlotData({...blockSlotData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={blockSlotData.startTime}
                    onChange={(e) => setBlockSlotData({...blockSlotData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={blockSlotData.endTime}
                    onChange={(e) => setBlockSlotData({...blockSlotData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Blocking</label>
                <textarea
                  value={blockSlotData.reason}
                  onChange={(e) => setBlockSlotData({...blockSlotData, reason: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter reason for blocking this time slot..."
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={blockSlotData.recurring}
                  onChange={(e) => setBlockSlotData({...blockSlotData, recurring: e.target.checked})}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
                  Recurring (apply to multiple dates)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockSlot}
                className="px-4 py-2 bg-gray-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-800"
              >
                Block Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotManagement;
