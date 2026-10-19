// src/lib/imageUpload.js
import fs from "fs";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageuploadcloudanary = async (file, folder, height, quality) => {
  try {
    // Validate input parameters
    if (!file || !file.filepath) {
      throw new Error('Invalid file object provided');
    }

    if (!folder) {
      throw new Error('Folder parameter is required');
    }

    // Check if file exists
    if (!fs.existsSync(file.filepath)) {
      throw new Error('File does not exist at the specified path');
    }

    // Get file stats to check size
    const stats = fs.statSync(file.filepath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    if (fileSizeInMB > 10) {
      throw new Error('File size exceeds 10MB limit');
    }

    const options = { 
      folder,
      resource_type: "auto",
      timeout: 60000, // 60 second timeout
      chunk_size: 6000000, // 6MB chunks for large files
    };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    // Read file with error handling
    let buffer;
    try {
      buffer = fs.readFileSync(file.filepath);
    } catch (readError) {
      console.error('File read error:', readError);
      throw new Error(`Failed to read file: ${readError.message}`);
    }

    // Convert to base64
    const base64Image = Buffer.from(buffer).toString("base64");
    
    // Detect actual file type from buffer
    let mimeType = 'image/png'; // default
    if (file.mimetype) {
      mimeType = file.mimetype;
    } else {
      // Basic mime type detection
      const header = buffer.toString('hex', 0, 4);
      if (header.startsWith('ffd8')) mimeType = 'image/jpeg';
      else if (header.startsWith('8950')) mimeType = 'image/png';
      else if (header.startsWith('4749')) mimeType = 'image/gif';
      else if (header.startsWith('5249')) mimeType = 'image/webp';
    }

    // Upload to Cloudinary with proper error handling
    const uploadResult = await cloudinary.v2.uploader.upload(
      `data:${mimeType};base64,${base64Image}`,
      options
    );

    // Validate upload result
    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('Cloudinary upload failed - no secure URL returned');
    }

    console.log('Upload successful:', {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      bytes: uploadResult.bytes
    });

    return uploadResult;

  } catch (error) {
    console.error('Cloudinary upload error:', {
      message: error.message,
      code: error.code,
      http_code: error.http_code,
      name: error.name
    });

    // Handle specific Cloudinary errors
    if (error.http_code === 499 || error.name === 'TimeoutError') {
      throw new Error('Upload timeout - please try again with a smaller image');
    }
    
    if (error.http_code === 400) {
      throw new Error('Invalid image format or corrupted file');
    }
    
    if (error.http_code === 401) {
      throw new Error('Cloudinary authentication failed - check API credentials');
    }
    
    if (error.http_code === 403) {
      throw new Error('Cloudinary access forbidden - check account permissions');
    }
    
    if (error.code === 'ENOENT') {
      throw new Error('File not found - please try uploading again');
    }
    
    if (error.code === 'EMFILE' || error.code === 'ENFILE') {
      throw new Error('Too many files open - please try again later');
    }

    // Generic error handling
    throw new Error(`Upload failed: ${error.message || 'Unknown error occurred'}`);
  }
};

export default imageuploadcloudanary;
