import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, Plus, Minus, X, MapPin, Star } from 'lucide-react';

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
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
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
          className={`w-10 h-10 text-sm rounded-lg font-medium transition-all duration-200 ${
            isSelected 
              ? 'bg-black text-white shadow-md transform scale-105' 
              : isToday
              ? 'bg-gray-200 text-black font-bold ring-2 ring-gray-400'
              : isDisabled 
              ? 'text-gray-300 cursor-not-allowed hover:bg-transparent' 
              : 'hover:bg-gray-100 text-gray-700 hover:shadow-sm'
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl transform animate-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-xl font-bold text-gray-900">{months[displayMonth]} {displayYear}</h3>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
            Select a date from today onwards
          </p>
          
          <div className="grid grid-cols-7 gap-1 mb-4">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Select Time</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-medium">Note:</span> Start time must be in the future.<br />
              Unavailable slots are shown in gray and cannot be selected.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => !slot.disabled && onTimeSelect(slot.value)}
                disabled={slot.disabled}
                className={`p-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                  selectedTime === slot.value 
                    ? 'bg-black text-white border-black shadow-lg transform scale-105' 
                    : slot.disabled 
                    ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm'
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Court Booking</h1>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>
        
        <div className="flex justify-center">
          {/* Main Booking Form - Centered */}
          <div className="w-full max-w-2xl">
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl">
              {/* Venue Info */}
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">SBR Badminton</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="font-medium">Satellite, Jodhpur Village</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <Star size={16} className="text-gray-600 fill-current" />
                    <span className="font-semibold text-gray-800">4.5</span>
                    <span className="text-gray-500">(6 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-8">
                {/* Sport Selection */}
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">Sport</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowSportDropdown(!showSportDropdown)}
                      className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🏸</span>
                        <span className="text-gray-900">{selectedSport}</span>
                      </div>
                      <ChevronDown size={20} className="text-gray-400" />
                    </button>
                    {showSportDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                        {sports.map(sport => (
                          <button
                            key={sport}
                            onClick={() => {
                              setSelectedSport(sport);
                              setShowSportDropdown(false);
                            }}
                            className="w-full text-left p-4 hover:bg-gray-50 transition-colors font-medium text-gray-900 border-b border-gray-100 last:border-b-0"
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
                  <label className="block text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">Date</label>
                  <button
                    onClick={() => setShowCalendar(true)}
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors font-medium"
                  >
                    <span className="text-gray-900">{formatDate(selectedDate)}</span>
                    <Calendar size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">Start Time</label>
                  <button
                    onClick={() => setShowTimeSlots(true)}
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors font-medium"
                  >
                    <span className="text-gray-900">{selectedTime}</span>
                    <Clock size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">Duration</label>
                  <div className="flex items-center justify-center gap-6 bg-gray-50 p-4 rounded-xl">
                    <button
                      onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                      className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg"
                    >
                      <Minus size={20} />
                    </button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{duration}</div>
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Hours</div>
                    </div>
                    <button
                      onClick={() => setDuration(prev => prev + 1)}
                      className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Court Selection */}
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">Court</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCourtDropdown(!showCourtDropdown)}
                      className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors font-medium"
                    >
                      <span className="text-gray-900">{selectedCourt || '--Select Court--'}</span>
                      <ChevronDown size={20} className="text-gray-400" />
                    </button>
                    {showCourtDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                        {courts.map(court => (
                          <button
                            key={court}
                            onClick={() => {
                              setSelectedCourt(court);
                              setShowCourtDropdown(false);
                            }}
                            className="w-full text-left p-4 hover:bg-gray-50 transition-colors font-medium text-gray-900 border-b border-gray-100 last:border-b-0"
                          >
                            {court}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Tables */}
                  {selectedTables.length > 0 && (
                    <div className="flex gap-3 mt-4">
                      {selectedTables.map(table => (
                        <span
                          key={table}
                          className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm"
                        >
                          {table}
                          <button
                            onClick={() => toggleTable(table)}
                            className="hover:bg-gray-700 rounded-full p-1 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Continue to Payment Button */}
                <div className="pt-4">
                  <button className="w-full bg-black text-white py-4 px-8 rounded-xl font-bold hover:bg-gray-800 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Continue to Payment - ₹{totalPrice.toLocaleString()}
                  </button>
                  <p className="text-center text-gray-500 text-sm mt-3">
                    Secure payment • No hidden charges
                  </p>
                </div>
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