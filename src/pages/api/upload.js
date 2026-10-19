 
import { IncomingForm } from "formidable";
import imageuploadcloudanary from "@/src/lib/imageUpload";

// Ensure formidable is set up to parse incoming form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Set timeout for the request
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.error('Upload request timeout');
      res.status(408).json({ 
        success: false, 
        message: 'Upload request timeout. Please try again.' 
      });
    }
  }, 30000); // 30 second timeout

  try {
    if (req.method !== "POST") {
      clearTimeout(timeoutId);
      return res.status(405).json({ 
        success: false, 
        message: "Method Not Allowed" 
      });
    }

    const form = new IncomingForm({ 
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      multiples: false
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          console.error("Form parse error:", err);
          clearTimeout(timeoutId);
          if (!res.headersSent) {
            return res.status(400).json({ 
              success: false, 
              message: "Error parsing form data.",
              error: err.message 
            });
          }
          return;
        }

        if (!files?.image) {
          console.error("No image file provided");
          clearTimeout(timeoutId);
          if (!res.headersSent) {
            return res.status(400).json({ 
              success: false, 
              message: "Image file is required." 
            });
          }
          return;
        }

        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(imageFile.mimetype)) {
          clearTimeout(timeoutId);
          if (!res.headersSent) {
            return res.status(400).json({ 
              success: false, 
              message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." 
            });
          }
          return;
        }

        // Upload to Cloudinary with timeout handling
        const uploadPromise = imageuploadcloudanary(
          imageFile,
          "pankajphoto",  
          400,             
          "auto"          
        );

        // Race between upload and timeout
        const result = await Promise.race([
          uploadPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Cloudinary upload timeout')), 25000)
          )
        ]);

        clearTimeout(timeoutId);
        
        if (!res.headersSent) {
          return res.status(200).json({ 
            success: true,
            message: "Image uploaded successfully",
            url: result.secure_url,
            public_id: result.public_id
          });
        }

      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        clearTimeout(timeoutId);
        
        if (!res.headersSent) {
          const errorMessage = uploadError.message.includes('timeout') 
            ? 'Upload timeout. Please try again with a smaller image.'
            : 'Image upload failed. Please try again.';
            
          return res.status(500).json({ 
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
          });
        }
      }
    });

  } catch (error) {
    console.error("Handler error:", error);
    clearTimeout(timeoutId);
    
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}
