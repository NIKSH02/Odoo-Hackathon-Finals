import React, { useState } from 'react';
import { X } from 'lucide-react';

// Pricing Modal Component
const PricingModal = ({ sport, isOpen, onClose }) => {
  if (!isOpen) return null;

  const pricingData = {
    badminton: {
      name: "Badminton Standard Synthetic",
      schedule: [
        {
          days: "Monday - Friday",
          slots: [
            { time: "05:00 AM - 07:00 AM", price: "INR 500.0 / hour" },
            { time: "04:00 PM - 10:00 PM", price: "INR 500.0 / hour" }
          ]
        },
        {
          days: "Saturday - Sunday",
          slots: [
            { time: "05:00 AM - 10:00 PM", price: "INR 500.0 / hour" }
          ]
        },
        {
          days: "Holiday(s)",
          slots: [
            { time: "05:00 AM - 10:00 PM", price: "INR 500.0 / hour" }
          ]
        }
      ]
    },
    "table-tennis": {
      name: "Table Tennis Premium",
      schedule: [
        {
          days: "Monday - Friday",
          slots: [
            { time: "06:00 AM - 08:00 AM", price: "INR 300.0 / hour" },
            { time: "05:00 PM - 11:00 PM", price: "INR 350.0 / hour" }
          ]
        }
      ]
    },
    "box-cricket": {
      name: "Box Cricket Standard",
      schedule: [
        {
          days: "All Days",
          slots: [
            { time: "06:00 AM - 10:00 PM", price: "INR 800.0 / hour" }
          ]
        }
      ]
    }
  };

  const data = pricingData[sport] || pricingData.badminton;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 capitalize">
            {sport?.replace('-', ' ')} Pricing
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">Note:</span> Pricing is subject to change and is controlled by the venue management.
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-1">{data.name}</h4>
            <div className="w-16 h-1 bg-black rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            {data.schedule.map((schedule, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white">
                <h5 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
                  {schedule.days}
                </h5>
                <div className="space-y-3">
                  {schedule.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-bold text-gray-900">{slot.price}</div>
                        <div className="text-sm text-gray-500">Per hour rate</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{slot.time}</div>
                        <div className="text-xs text-gray-500">Available hours</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sports Available Component
export default function SportsAvailable() {
  const [selectedSport, setSelectedSport] = useState(null);
  
  const sports = [
    { id: 'badminton', name: 'Badminton', icon: '🏸', description: 'Indoor courts available' },
    { id: 'table-tennis', name: 'Table Tennis', icon: '🏓', description: 'Premium tables' },
    { id: 'box-cricket', name: 'Box Cricket', icon: '🏏', description: 'Outdoor facility' }
  ];

  return (
    <>
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Sports Available</h3>
          <span className="text-sm text-gray-500">Click to view pricing</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className="group bg-white border-2 border-gray-200 p-4 rounded-xl text-center hover:border-black hover:shadow-md transition-all duration-200"
            >
              <div className="text-2xl mb-2">
                {sport.icon}
              </div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{sport.name}</div>
              <div className="text-xs text-gray-500 mb-2">{sport.description}</div>
              <div className="text-xs text-gray-600 font-medium group-hover:text-black transition-colors">
                View Pricing
              </div>
            </button>
          ))}
        </div>
      </div>

      <PricingModal 
        sport={selectedSport}
        isOpen={!!selectedSport}
        onClose={() => setSelectedSport(null)}
      />
    </>
  );
}