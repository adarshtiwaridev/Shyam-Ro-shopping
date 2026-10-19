import connectDB from "@/src/lib/dbConnect"; 
import Category from "@/src/models/Category"; 
import { verifyAdminAccess } from "@/src/lib/authUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const auth = await verifyAdminAccess(req, res);
  if (!auth.authorized) {
    return res.status(auth.status).json({ success: false, message: auth.message });
  }

  try {
    await connectDB();

    const { name, catImage, description, categoryType } = req.body;

    if (!name || !catImage || !categoryType) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if category with the same name exists
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }

    const newCategory = await Category.create({
      name,
      catImage,
      description,
      categoryType,
    });

    return res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
