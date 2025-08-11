import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, Plus, Minus, X } from 'lucide-react';

// Calendar Modal Component
const CalendarModal = ({ isOpen, onClose, selectedDate, onDateSelect }) => {
  if (!isOpen) return null;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (day) => {
    const date = new Date(displayYear, displayMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const isDateSelected = (day) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === displayMonth && 
           selectedDate.getFullYear() === displayYear;
  };

  const handleDateClick = (day) => {
    if (isDateDisabled(day)) return;
    const newDate = new Date(displayYear, displayMonth, day);
    onDateSelect(newDate);
    onClose();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayMonth, displayYear);
    const firstDay = getFirstDayOfMonth(displayMonth, displayYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day);
      const isSelected = isDateSelected(day);
      const isToday = today.getDate() === day && today.getMonth() === displayMonth && today.getFullYear() === displayYear;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`w-8 h-8 text-sm rounded-full transition-colors ${
            isSelected 
              ? 'bg-green-500 text-white font-medium' 
              : isToday
              ? 'bg-blue-100 text-blue-600 font-medium'
              : isDisabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (displayMonth === 0) {
        setDisplayMonth(11);
        setDisplayYear(displayYear - 1);
      } else {
        setDisplayMonth(displayMonth - 1);
      }
    } else {
      if (displayMonth === 11) {
        setDisplayMonth(0);
        setDisplayYear(displayYear + 1);
      } else {
        setDisplayMonth(displayMonth + 1);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="text-lg font-semibold">{months[displayMonth]} {displayYear}</h3>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">The selected date must be today or later</p>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Time Slot Modal Component
const TimeSlotModal = ({ isOpen, onClose, selectedTime, onTimeSelect, selectedDate }) => {
  if (!isOpen) return null;

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();

    const isToday =
      selectedDate &&
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();

    // Generate slots from 5 AM to 11 PM inclusive
    for (let hour = 5; hour <= 22; hour++) {
      const slotDate = new Date(
        selectedDate ? selectedDate.getFullYear() : now.getFullYear(),
        selectedDate ? selectedDate.getMonth() : now.getMonth(),
        selectedDate ? selectedDate.getDate() : now.getDate(),
        hour,
        0,
        0,
        0
      );

      // Format display time in 12-hour clock
      let displayHour = hour % 12 || 12;
      let ampm = hour < 12 ? 'AM' : 'PM';
      const displayTime = `${displayHour}:00 ${ampm}`;

      // Disable past times if today
      const isPastTime = isToday && slotDate.getTime() <= now.getTime();

      // Demo unavailable times
      const isUnavailable = [8, 14, 19].includes(hour);

      slots.push({
        time: displayTime,
        value: slotDate,
        disabled: isPastTime || isUnavailable,
        reason: isPastTime ? 'Past time' : isUnavailable ? 'Unavailable' : null
      });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Select Time</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Start time must be in the future<br />
            Unavailable time slots are disabled and cannot be selected
          </p>
          
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => !slot.disabled && onTimeSelect(slot.value)}
                disabled={slot.disabled}
                className={`p-2 text-sm rounded border transition-colors ${
                  selectedTime === slot.value 
                    ? 'bg-green-500 text-white border-green-500' 
                    : slot.disabled 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Booking Page Component
const VenueBookingPage = () => {
  const [selectedSport, setSelectedSport] = useState('Badminton');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('01:00 PM');
  const [duration, setDuration] = useState(2);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedTables, setSelectedTables] = useState(['Table 1']);
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [showCourtDropdown, setShowCourtDropdown] = useState(false);

  const sports = ['Badminton', 'Table Tennis', 'Box Cricket'];
  const courts = ['Court 1', 'Court 2', 'Court 3'];

  const formatDate = (date) => {
    if (!date) return '2025-05-06';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toggleTable = (table) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const totalPrice = duration * 600; // ₹600 per hour base rate

  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Court Booking</h1>
        
        <div className="flex justify-center">
          {/* Main Booking Form - Centered */}
          <div className="w-full max-w-2xl">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              {/* Venue Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">SBR Badminton</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-red-500 flex items-center gap-1">
                    📍 Satellite, Jodhpur Village
                  </span>
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span className="text-gray-600">4.5 (6)</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-6">
                {/* Sport Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sport</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowSportDropdown(!showSportDropdown)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span>🏸</span>
                        <span>{selectedSport}</span>
                      </div>
                      <ChevronDown size={16} />
                    </button>
                    {showSportDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {sports.map(sport => (
                          <button
                            key={sport}
                            onClick={() => {
                              setSelectedSport(sport);
                              setShowSportDropdown(false);
                            }}
                            className="w-full text-left p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {sport}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                  >
                    <span>{formatDate(selectedDate)}</span>
                    <Calendar size={16} />
                  </button>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <button
                    onClick={() => setShowTimeSlots(true)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                  >
                    <span>{selectedTime}</span>
                    <Clock size={16} />
                  </button>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-medium min-w-[60px] text-center">{duration} Hr</span>
                    <button
                      onClick={() => setDuration(prev => prev + 1)}
                      className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Court Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Court</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCourtDropdown(!showCourtDropdown)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                    >
                      <span>{selectedCourt || '--Select Court--'}</span>
                      <ChevronDown size={16} />
                    </button>
                    {showCourtDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {courts.map(court => (
                          <button
                            key={court}
                            onClick={() => {
                              setSelectedCourt(court);
                              setShowCourtDropdown(false);
                            }}
                            className="w-full text-left p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {court}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Tables */}
                  <div className="flex gap-2 mt-3">
                    {selectedTables.map(table => (
                      <span
                        key={table}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {table}
                        <button
                          onClick={() => toggleTable(table)}
                          className="hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Continue to Payment Button */}
                <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors text-lg">
                  Continue to Payment - ₹{totalPrice.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CalendarModal 
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      <TimeSlotModal 
        isOpen={showTimeSlots}
        onClose={() => setShowTimeSlots(false)}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default VenueBookingPage;