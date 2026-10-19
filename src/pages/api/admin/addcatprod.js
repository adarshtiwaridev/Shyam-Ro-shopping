import connectDB from "@/src/lib/dbConnect";
import Category from "@/src/models/Category";
import Product from "@/src/models/Product";
import { verifyAdminAccess } from "@/src/lib/authUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const auth = await verifyAdminAccess(req, res);
  if (!auth.authorized) {
    return res.status(auth.status).json({ success: false, message: auth.message });
  }

  await connectDB();

  const slugify = (str) => {
    return (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const { categoryId, products } = req.body;

  if (!categoryId || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ success: false, message: "Category ID and products array are required" });
  }

  const formattedProducts = products.map((prod) => ({
    ...prod,
    slug: prod.slug || `${slugify(prod.name)}-${Math.random().toString(36).substring(2, 6)}`,
    skuid: prod.skuid || `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    category: categoryId,
  }));

  try {
    const createdProducts = await Product.insertMany(formattedProducts);

    // Add new products to category
    const productIds = createdProducts.map((p) => p._id);
    await Category.findByIdAndUpdate(categoryId, {
      $addToSet: { products: { $each: productIds } },
    });

    return res.status(201).json({ success: true, products: createdProducts });
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({ success: false, message: "Failed to add products", error: err.message });
  }
}
