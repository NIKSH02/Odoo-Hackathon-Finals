import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Image Carousel Component
export default function ImageCarousel() {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
  ];

  const imageDescriptions = [
    "Main Court View",
    "Premium Facilities",
    "Indoor Arena",
    "Equipment Ready",
    "Modern Infrastructure"
  ];
  
  return (
    <div className="mb-8">
      {/* Main Image Display */}
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96 mb-6 shadow-2xl group">
        <img 
          src={images[currentImage]} 
          alt={`Venue image ${currentImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <div className="absolute bottom-6 left-6">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
              <h4 className="text-white text-xl font-bold mb-1">
                {imageDescriptions[currentImage]}
              </h4>
              <p className="text-white/80 text-sm">
                Image {currentImage + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 hover:scale-110"
          onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 hover:scale-110"
          onClick={() => setCurrentImage(prev => (prev + 1) % images.length)}
        >
          <ChevronRight size={24} className="text-gray-900" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentImage === index 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Image Thumbnails */}
      <div className="grid grid-cols-5 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`relative aspect-video rounded-xl overflow-hidden border-3 transition-all duration-300 transform hover:-translate-y-1 ${
              currentImage === index 
                ? 'border-black shadow-xl scale-105' 
                : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
            }`}
          >
            <img 
              src={image} 
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              currentImage === index 
                ? 'bg-black/20' 
                : 'bg-transparent hover:bg-black/10'
            }`} />
            <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full transition-all duration-300 ${
              currentImage === index ? 'bg-white' : 'bg-white/60'
            }`} />
          </button>
        ))}
      </div>

      {/* Image Counter */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-full">
          Viewing {currentImage + 1} of {images.length} images
        </span>
      </div>
    </div>
  );
}