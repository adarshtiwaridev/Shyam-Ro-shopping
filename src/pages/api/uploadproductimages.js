import { IncomingForm } from "formidable";
import imageuploadcloudanary from "@/src/lib/imageUpload";

// Ensure formidable is set up to parse incoming form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = new IncomingForm({ keepExtensions: true, multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files?.image) {
      console.error("Form parse error:", err);
      return res.status(400).json({ message: "Image file is required." });
    }

    const images = Array.isArray(files.image) ? files.image : [files.image];
    const urls = [];

    try {
      for (const img of images) {
        const result = await imageuploadcloudanary(
          img,        
          "pankajphoto",  
          400,        
          "auto"           
        );
        urls.push(result.secure_url);
      }

      return res.status(200).json({ urls });
    } catch (error) {
      console.error("Cloudinary error:", error);
      return res.status(500).json({ message: "Image upload failed." });
    }
  });
}
