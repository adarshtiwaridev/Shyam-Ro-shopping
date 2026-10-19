import dbConnect from '../../lib/dbConnect';
import Product from '../../models/Product';
import Category from '../../models/Category';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const products = await Product.find({})
      .populate({ path: 'category'})
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 