import { useState } from 'react';
import { getOptimizedProfileImage, generateFallbackAvatar, getConsistentColor } from '@/src/lib/imageUtils';

/**
 * ProfileImage Component
 * Handles profile images with proper fallbacks to avoid Google rate limiting
 */
const ProfileImage = ({ 
  user, 
  size = 40, 
  className = '', 
  alt = 'Profile',
  showFallback = true 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get optimized image URL
  const imageUrl = getOptimizedProfileImage(user || {});
  
  // Generate fallback for error cases
  const fallbackUrl = generateFallbackAvatar(
    user?.name || user?.firstName || 'User', 
    getConsistentColor(user?.name || user?.firstName || 'User')
  );

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  // If image failed to load or we should show fallback
  if (imageError || !imageUrl || imageUrl.includes('googleusercontent.com')) {
    return (
      <div 
        className={`inline-block ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={fallbackUrl}
          alt={alt}
          width={size}
          height={size}
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"
          style={{ width: size, height: size }}
        />
      )}
      
      <img
        src={imageUrl}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-full object-cover transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ width: size, height: size }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

/**
 * ProfileAvatar - Larger avatar component for profile pages
 */
export const ProfileAvatar = ({ user, size = 96, className = '', editable = false, onEdit }) => {
  return (
    <div className={`relative ${className}`}>
      <ProfileImage 
        user={user} 
        size={size} 
        className="border-4 border-white shadow-lg"
        alt={`${user?.name || 'User'}'s profile`}
      />
      
      {editable && (
        <button
          onClick={onEdit}
          className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Edit profile picture"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * ProfileImageWithStatus - Shows online/offline status
 */
export const ProfileImageWithStatus = ({ 
  user, 
  size = 40, 
  className = '', 
  isOnline = false 
}) => {
  return (
    <div className={`relative ${className}`}>
      <ProfileImage user={user} size={size} />
      
      <div 
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
        title={isOnline ? 'Online' : 'Offline'}
      />
    </div>
  );
};

export default ProfileImage;
