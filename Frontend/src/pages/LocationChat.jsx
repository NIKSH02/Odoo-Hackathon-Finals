import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SideBar from '../components/SideBar'


const LocationChat = () => {
  const { user, isAuthenticated } = useAuth();

  console.log('user in chat : ' , JSON.stringify(user));
  console.log("isauth in chat. " , isAuthenticated);

  // Add loading check for user
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white via-purple-50 to-indigo-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-300"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center space-y-6 backdrop-blur-sm bg-white/20 p-12 rounded-3xl border border-white/20 shadow-2xl">
          {/* Enhanced loading spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-[#7968ed] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-300 rounded-full animate-spin animate-reverse delay-150"></div>
          </div>
          <div className="text-gray-700 font-semibold text-lg animate-pulse">Loading your conversations...</div>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-[#7968ed] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#7968ed] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#7968ed] rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  const normalizedLocation = ('Unknown Location').trim().toLowerCase();
  const currentUser = {
    userId: user._id,
    userName: user.fullName,
    location: ('Student Z').trim().toLowerCase()
  };

  console.log("currentuser in chat : ", JSON.stringify(currentUser))

  // State management
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Location popup states
  const [showLocationPopup, setShowLocationPopup] = useState(true); // Auto-show on page load
  const [userLocation, setUserLocation] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);

  // Refs
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Location functions
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const city = data.city || data.locality || data.principalSubdivision || 'Unknown Location';
            
            setUserLocation(city);
            setIsGettingLocation(false);
          } catch (error) {
            console.error('Error getting location:', error);
            setUserLocation('Unable to get location');
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setUserLocation('Location access denied');
          setIsGettingLocation(false);
        }
      );
    } else {
      setUserLocation('Geolocation not supported');
      setIsGettingLocation(false);
    }
  };

  const handleLocationSubmit = () => {
    const finalLocation = userLocation || manualLocation;
    if (finalLocation.trim()) {
      // Store the location in a variable (you can use this wherever needed)
      console.log('Selected location:', finalLocation);
      setLocationSelected(true);
      setShowLocationPopup(false);
      // You can add any additional logic here to use the location
    }
  };

  const LocationPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Welcome! 👋</h2>
        <p className="text-gray-600 mb-4 text-sm">Please select your location to continue to the chat</p>
        
        {/* Live Location Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Get Live Location</h3>
          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isGettingLocation ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Getting Location...
              </>
            ) : (
              '📍 Get Current Location'
            )}
          </button>
          
          {userLocation && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              <strong>Detected:</strong> {userLocation}
            </div>
          )}
        </div>

        {/* Manual Input Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Or Enter Manually</h3>
          <input
            type="text"
            placeholder="Enter your city name..."
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={handleLocationSubmit}
            disabled={!userLocation && !manualLocation.trim()}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500 text-white py-2 px-4 rounded-md transition-colors font-medium"
          >
            {(!userLocation && !manualLocation.trim()) ? 'Please select a location' : 'Continue to Chat'}
          </button>
        </div>
        
        {/* Required notice */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          * Location is required to join the chat
        </p>
      </div>
    </div>
  );

  // Initialize socket connection
  useEffect(() => {
    const serverUrl ='http://localhost:8080';
    
    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError(null);
      
      // Join location-based room
      socket.emit('joinLocation', {
        userId: currentUser.userId,
        userName: currentUser.userName,
        location: currentUser.location
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to chat server');
      setIsConnected(false);
    });

    // Chat event handlers
    socket.on('receiveMessage', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    socket.on('userJoined', (data) => {
      console.log(`${data.userName} joined the chat`);
    });

    socket.on('userLeft', (data) => {
      console.log(`${data.userName} left the chat`);
    });

    socket.on('activeUsersCount', (data) => {
      setActiveUsers(data.activeCount);
    });

    socket.on('activeUsersUpdate', (data) => {
      setActiveUsers(data.activeCount);
    });

    socket.on('userTyping', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => {
          if (!prev.find(user => user.userId === data.userId)) {
            return [...prev, { userId: data.userId, userName: data.userName }];
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setError(error.message);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.emit('leaveLocation', {
          userId: currentUser.userId,
          location: currentUser.location
        });
        socket.disconnect();
      }
    };
  }, [currentUser.userId, currentUser.userName, currentUser.location]);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        const serverUrl = 'http://localhost:8080';
        const response = await fetch(`${serverUrl}/api/messages/${encodeURIComponent(currentUser.location)}/recent`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(data.data.messages);
          }
        } else {
          console.error('Failed to load chat history');
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        setError('Failed to load chat history');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser.location) {
      loadChatHistory();
    }
  }, [currentUser.location]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socketRef.current || !isConnected) {
      return;
    }

    // Stop typing indicator
    if (isTyping) {
      socketRef.current.emit('typing', {
        userId: currentUser.userId,
        userName: currentUser.userName,
        location: currentUser.location,
        isTyping: false
      });
      setIsTyping(false);
    }

    // Send message
    socketRef.current.emit('sendMessage', {
      userId: currentUser.userId,
      userName: currentUser.userName,
      message: newMessage.trim(),
      location: currentUser.location
    });

    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketRef.current || !isConnected) return;

    // Start typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        userId: currentUser.userId,
        userName: currentUser.userName,
        location: currentUser.location,
        isTyping: true
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketRef.current.emit('typing', {
          userId: currentUser.userId,
          userName: currentUser.userName,
          location: currentUser.location,
          isTyping: false
        });
      }
    }, 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const MessageBubble = ({ message, isOwn }) => (
    <div className={`flex mb-6 ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`relative max-w-sm lg:max-w-md transition-all duration-300 hover:scale-[1.02] ${
        isOwn ? 'order-1' : 'order-2'
      }`}>
        {/* Message bubble with glassmorphism effect */}
        <div className={`px-6 py-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
          isOwn 
            ? 'bg-gradient-to-br from-[#7968ed] to-[#8b7aef] text-white border-white/20 shadow-lg hover:shadow-xl shadow-purple-500/25' 
            : 'bg-white/80 text-gray-800 border-gray-200/50 shadow-lg hover:shadow-xl hover:bg-white/90'
        }`}>
          {!isOwn && (
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#7968ed] to-purple-600 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-white">
                  {message.senderName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#7968ed]">
                {message.senderName}
              </div>
            </div>
          )}
          <div className="break-words leading-relaxed">{message.message}</div>
          <div className={`text-xs mt-2 opacity-70 ${
            isOwn ? 'text-purple-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>

        {/* Message tail */}
        <div className={`absolute top-4 w-3 h-3 transform rotate-45 ${
          isOwn 
            ? '-right-1 bg-gradient-to-br from-[#7968ed] to-[#8b7aef]' 
            : '-left-1 bg-white/80 border-l border-b border-gray-200/50'
        }`}></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white via-purple-50 to-indigo-100 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#7968ed]/20 to-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-300"></div>
        </div>
        
        <div className="relative z-10 text-center backdrop-blur-sm bg-white/30 p-12 rounded-3xl border border-white/30 shadow-2xl">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-[#7968ed] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-300 rounded-full animate-spin animate-reverse delay-150"></div>
          </div>
          <p className="text-gray-700 font-semibold text-xl mb-4">Loading chat...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-[#7968ed] rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-[#7968ed] rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-[#7968ed] rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className ='flex flex-col' >
      <div>
        <SideBar />
      </div>
      <div className="flex flex-col h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#7968ed]/10 to-purple-300/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-indigo-300/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Enhanced Header */}
        <header className="relative z-10 backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Enhanced location avatar */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#7968ed] to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200">
                  <span className="text-white font-bold text-lg drop-shadow-sm">
                    {currentUser.location.split(',')[0].charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
              </div>
      
              <div>
                <h1 className="font-bold text-xl text-gray-800 mb-1">{currentUser.location}</h1>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-gray-600 font-medium">
                    {activeUsers} active users
                  </p>
                  {!isConnected && (
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                      Disconnected
                    </span>
                  )}
                </div>
              </div>
            </div>
      
            {/* Enhanced connection status */}
            <div className="flex items-center space-x-3">
              <div className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                isConnected ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
              }`}>
                {isConnected && (
                  <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
                )}
              </div>
              <span className={`text-sm font-semibold transition-colors duration-300 ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </header>
        {/* Enhanced Error Banner */}
        {error && (
          <div className="relative z-10 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 shadow-sm animate-slide-down">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        {/* Enhanced Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 relative z-10 scrollbar-thin scrollbar-thumb-purple-300/50 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="text-center mt-32 animate-fade-in">
              <div className="relative inline-block mb-8">
                <div className="text-8xl animate-bounce delay-300">💬</div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7968ed]/20 to-purple-400/20 rounded-full blur-2xl transform scale-150"></div>
              </div>
              <p className="text-gray-600 text-xl font-medium mb-2">No messages yet</p>
              <p className="text-gray-500">Start the conversation and connect with others!</p>
              <div className="mt-6 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-[#7968ed] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#7968ed] rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-[#7968ed] rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MessageBubble
                    message={message}
                    isOwn={message.senderId === currentUser.userId}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Enhanced Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start mb-4 animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl max-w-xs border border-gray-200/50 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 bg-[#7968ed] rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-[#7968ed] rounded-full animate-bounce delay-150"></div>
                    <div className="w-2.5 h-2.5 bg-[#7968ed] rounded-full animate-bounce delay-300"></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {typingUsers.length === 1
                      ? `${typingUsers[0].userName} is typing...`
                      : `${typingUsers.length} people are typing...`
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Enhanced Message Input */}
        <div className="relative z-10 backdrop-blur-md bg-white/90 border-t border-white/30 px-6 py-4 shadow-2xl">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
            {/* Enhanced Attachment Button */}
            <button
              type="button"
              className="group flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#7968ed]/10 hover:to-purple-200/50 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isConnected}
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-[#7968ed] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            {/* Enhanced Message Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-[#7968ed]/50 focus:border-[#7968ed]/30 disabled:opacity-50 transition-all duration-300 hover:bg-white/90 hover:shadow-md placeholder-gray-400 text-gray-800 font-medium"
                disabled={!isConnected}
                maxLength={1000}
              />
              {newMessage && (
                <div className="absolute right-4 bottom-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                  {newMessage.length}/1000
                </div>
              )}
            </div>
            {/* Enhanced Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="group flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#7968ed]/10 hover:to-purple-200/50 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
              disabled={!isConnected}
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-[#7968ed] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {/* Enhanced Send Button */}
            <button
              type="submit"
              disabled={!isConnected || !newMessage.trim()}
              className="group flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#7968ed] to-purple-600 hover:from-[#8b7aef] hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          {/* Enhanced Connection Status */}
          {!isConnected && (
            <div className="flex items-center justify-center mt-3 animate-fade-in">
              <div className="backdrop-blur-sm bg-red-50/80 border border-red-200/50 rounded-full px-4 py-2 shadow-lg">
                <span className="text-sm text-red-600 flex items-center font-medium">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  Reconnecting to server...
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Enhanced Quick Actions (Mobile) */}
        {/* <div className="md:hidden relative z-10 backdrop-blur-md bg-white/90 border-t border-white/30 px-6 py-3 shadow-2xl">
          <div className="flex justify-center space-x-8">
            <button className="group flex flex-col items-center text-gray-600 hover:text-[#7968ed] transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#7968ed]/10 rounded-xl flex items-center justify-center mb-1 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M17 11a3 3 0 11-6 0 3 3 0 016 0zm-3-7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Users</span>
            </button>
      
            <button
              onClick={scrollToBottom}
              className="group flex flex-col items-center text-gray-600 hover:text-[#7968ed] transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#7968ed]/10 rounded-xl flex items-center justify-center mb-1 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <span className="text-xs font-medium">Scroll</span>
            </button>
            <button className="group flex flex-col items-center text-gray-600 hover:text-[#7968ed] transition-all duration-300 transform hover:scale-105">
              <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#7968ed]/10 rounded-xl flex items-center justify-center mb-1 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div> */}
        {/* Enhanced Floating Action Button for scroll to bottom */}
        {messages.length > 0 && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 z-20 w-14 h-14 bg-gradient-to-br from-[#7968ed] to-purple-600 hover:from-[#8b7aef] hover:to-purple-700 rounded-full shadow-2xl hover:shadow-purple-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce-gentle"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slide-down {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes bounce-gentle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out both;
          }
          .animate-slide-down {
            animation: slide-down 0.4s ease-out;
          }
          .animate-bounce-gentle {
            animation: bounce-gentle 2s infinite;
          }
          .animate-reverse {
            animation-direction: reverse;
          }
          .scrollbar-thin {
            scrollbar-width: thin;
          }
          .scrollbar-thumb-purple-300\/50::-webkit-scrollbar-thumb {
            background-color: rgba(196, 181, 253, 0.5);
            border-radius: 9999px;
          }
          .scrollbar-track-transparent::-webkit-scrollbar-track {
            background-color: transparent;
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(121, 104, 237, 0.3);
            border-radius: 9999px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(121, 104, 237, 0.5);
          }
          /* Enhanced glassmorphism effects */
          .backdrop-blur-md {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          .backdrop-blur-sm {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
        `}</style>
        
        {/* Location Popup */}
        {showLocationPopup && <LocationPopup />}
      </div>
    </div>
  );
};

export default LocationChat;