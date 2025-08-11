import React from 'react';

const ProfileImage = ({ 
  src, 
  alt = "Profile", 
  size = "w-24 h-24", 
  fallbackText = "?",
  className = "" 
}) => {
  // Fix Cloudinary rotation issues by adding auto-orient transformation
  const getOptimizedImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.includes('cloudinary.com')) {
      // Add transformations to fix rotation and optimize the image
      // a_exif automatically rotates image based on EXIF orientation data
      const transformations = 'a_exif,f_auto,q_auto:good,c_fill,g_face';
      return imageUrl.replace('/upload/', `/upload/${transformations}/`);
    }
    
    return imageUrl;
  };

  const optimizedSrc = getOptimizedImageUrl(src);

  if (!optimizedSrc) {
    return (
      <div className={`${size} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${className}`}>
        <span className="text-white font-semibold text-lg">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={`${size} rounded-full object-cover border-4 border-white shadow-lg ${className}`}
      onError={(e) => {
        // Fallback if image fails to load
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  );
};

export default ProfileImage;
