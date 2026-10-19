import { getSafeProfileImage, generateFallbackAvatar, getConsistentColor } from '@/src/lib/imageUtils';

/**
 * Image Proxy API - Handles profile image requests with fallbacks
 * Resolves Google profile image rate limiting issues
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url, name, email } = req.query;

    // If no URL provided, generate fallback
    if (!url) {
      if (!name) {
        return res.status(400).json({ message: 'Either URL or name is required' });
      }
      
      const fallbackImage = generateFallbackAvatar(name, getConsistentColor(name));
      
      // Return SVG directly
      const svgData = fallbackImage.split(',')[1];
      const svgBuffer = Buffer.from(svgData, 'base64');
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      return res.send(svgBuffer);
    }

    // For Google images, return fallback to avoid rate limiting
    if (url.includes('googleusercontent.com')) {
      const fallbackImage = generateFallbackAvatar(name || 'User', getConsistentColor(name || 'User'));
      
      // Return SVG directly
      const svgData = fallbackImage.split(',')[1];
      const svgBuffer = Buffer.from(svgData, 'base64');
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      return res.send(svgBuffer);
    }

    // For non-Google images, try to proxy them
    try {
      const imageResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
        },
        timeout: 5000, // 5 second timeout
      });

      if (!imageResponse.ok) {
        throw new Error(`HTTP ${imageResponse.status}`);
      }

      const contentType = imageResponse.headers.get('content-type');
      
      // Validate content type
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Invalid content type');
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      return res.send(Buffer.from(imageBuffer));

    } catch (fetchError) {
      console.warn('Failed to fetch image:', fetchError.message);
      
      // Return fallback on fetch error
      const fallbackImage = generateFallbackAvatar(name || 'User', getConsistentColor(name || 'User'));
      
      const svgData = fallbackImage.split(',')[1];
      const svgBuffer = Buffer.from(svgData, 'base64');
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(svgBuffer);
    }

  } catch (error) {
    console.error('Image proxy error:', error);
    
    // Return a generic fallback
    const fallbackImage = generateFallbackAvatar('?', '#6B7280');
    const svgData = fallbackImage.split(',')[1];
    const svgBuffer = Buffer.from(svgData, 'base64');
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    return res.send(svgBuffer);
  }
}
