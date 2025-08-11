import React from 'react';
import { Wifi, Car, AirVent, Shield, Droplets, Zap, Users, Coffee } from 'lucide-react';

// Amenities Component
export default function Amenities() {
  const amenities = [
    { name: 'Parking', icon: Car, available: true, description: 'Free parking space' },
    { name: 'Restroom', icon: Droplets, available: true, description: 'Clean facilities' },
    { name: 'Refreshments', icon: Coffee, available: true, description: 'Snacks & drinks' },
    { name: 'CCTV Surveillance', icon: Shield, available: true, description: '24/7 security' },
    { name: 'Air Conditioning', icon: AirVent, available: true, description: 'Climate controlled' },
    { name: 'Seating Area', icon: Users, available: true, description: 'Comfortable seating' },
    { name: 'WiFi', icon: Wifi, available: true, description: 'High-speed internet' },
    { name: 'Power Backup', icon: Zap, available: true, description: 'Uninterrupted supply' }
  ];

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Amenities & Facilities</h3>
        <span className="text-sm text-gray-500">Available facilities</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {amenities.map((amenity, index) => {
          const IconComponent = amenity.icon;
          return (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-xl p-3 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  amenity.available 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <IconComponent size={18} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm ${
                    amenity.available ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {amenity.name}
                  </h4>
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    amenity.available ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}