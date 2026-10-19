/**
 * Image Utilities - Handle profile images and caching
 * Resolves Google profile image rate limiting issues
 */

/**
 * Generate a fallback avatar URL using initials
 * @param {string} name - User's full name
 * @param {string} backgroundColor - Background color (optional)
 * @returns {string} Data URL for avatar
 */
export const generateFallbackAvatar = (name, backgroundColor = '#3B82F6') => {
  if (!name) return null;
  
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
  
  // Create SVG avatar with initials
  const svg = `
    <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" fill="${backgroundColor}" rx="48"/>
      <text x="48" y="48" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
            text-anchor="middle" dominant-baseline="central" fill="white">
        ${initials}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

/**
 * Get a safe profile image URL with fallback
 * @param {string} originalUrl - Original Google profile image URL
 * @param {string} userName - User's name for fallback
 * @returns {string} Safe image URL or fallback
 */
export const getSafeProfileImage = (originalUrl, userName) => {
  // If no original URL, return fallback
  if (!originalUrl) {
    return generateFallbackAvatar(userName);
  }
  
  // For Google images, use a proxied version or fallback
  if (originalUrl.includes('googleusercontent.com')) {
    // Return fallback to avoid rate limiting
    return generateFallbackAvatar(userName);
  }
  
  return originalUrl;
};

/**
 * Generate consistent color based on user name
 * @param {string} name - User's name
 * @returns {string} Hex color code
 */
export const getConsistentColor = (name) => {
  if (!name) return '#3B82F6';
  
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6366F1', // Indigo
  ];
  
  // Generate consistent index based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Create Gravatar URL as alternative
 * @param {string} email - User's email
 * @param {number} size - Image size (default: 96)
 * @returns {string} Gravatar URL
 */
export const getGravatarUrl = (email, size = 96) => {
  if (!email) return null;
  
  // Simple hash function for email (for demo purposes)
  // In production, use proper MD5 hash
  const hash = btoa(email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};

/**
 * Validate if image URL is accessible
 * @param {string} url - Image URL to validate
 * @returns {Promise<boolean>} Whether image is accessible
 */
export const validateImageUrl = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Image validation failed:', error);
    return false;
  }
};

/**
 * Get optimized profile image with multiple fallbacks
 * @param {Object} user - User object with image, name, email
 * @returns {string} Optimized image URL
 */
export const getOptimizedProfileImage = (user) => {
  const { image, name, email } = user;
  
  // Priority order:
  // 1. Fallback avatar (to avoid Google rate limiting)
  // 2. Gravatar (if email available)
  // 3. Original image (if not Google)
  
  if (image && !image.includes('googleusercontent.com')) {
    return image;
  }
  
  if (email) {
    return getGravatarUrl(email);
  }
  
  return generateFallbackAvatar(name, getConsistentColor(name));
};
