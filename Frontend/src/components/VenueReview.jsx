import React, { useState } from 'react';
import { Star, Calendar, ThumbsUp, ChevronDown } from 'lucide-react';

// Reviews Component
export default function VenueReviews() {
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const reviews = [
    { name: "Mitchell Admin", rating: 5, comment: "Excellent facilities and well-maintained courts. The staff is very helpful and professional.", date: "9 June 2025, 5:30 PM", helpful: 12 },
    { name: "Sarah Johnson", rating: 5, comment: "Amazing experience! The booking process was smooth and the venue exceeded expectations.", date: "10 June 2025, 3:15 PM", helpful: 8 },
    { name: "David Chen", rating: 4, comment: "Good facilities overall. Could use better ventilation but great value for money.", date: "11 June 2025, 7:45 AM", helpful: 5 },
    { name: "Emma Wilson", rating: 5, comment: "Perfect venue for weekend games. Clean, modern, and well-organized.", date: "12 June 2025, 2:20 PM", helpful: 15 },
    { name: "James Rodriguez", rating: 5, comment: "Top-notch badminton courts with excellent lighting. Highly recommended!", date: "13 June 2025, 6:00 PM", helpful: 10 },
    { name: "Lisa Thompson", rating: 4, comment: "Great location and facilities. The only downside is parking can get crowded during peak hours.", date: "14 June 2025, 1:30 PM", helpful: 7 }
  ];

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="mb-8">
      {/* Header with Stats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Player Reviews & Ratings</h3>
            <div className="w-8 h-1 bg-black rounded-full"></div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={`${i < Math.floor(averageRating) ? 'fill-black text-black' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-gray-900">{averageRating}</span>
            </div>
            <p className="text-sm text-gray-600">{reviews.length} total reviews</p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={`${i < Math.floor(averageRating) ? 'fill-black text-black' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="text-sm text-gray-600">Overall Rating</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">5-Star Reviews</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {reviews.reduce((sum, r) => sum + r.helpful, 0)}
              </div>
              <div className="text-sm text-gray-600">Helpful Votes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review, index) => (
          <div key={index} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${i < review.rating ? 'fill-black text-black' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600 font-medium">{review.rating}/5</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>{review.date}</span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4 text-base">
              {review.comment}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
                <ThumbsUp size={16} />
                <span>Helpful ({review.helpful})</span>
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Verified Booking</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {!showAllReviews && reviews.length > 3 && (
        <div className="text-center mt-8">
          <button 
            onClick={() => setShowAllReviews(true)}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>Load More Reviews</span>
            <ChevronDown size={20} />
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Showing {displayedReviews.length} of {reviews.length} reviews
          </p>
        </div>
      )}
    </div>
  );
}