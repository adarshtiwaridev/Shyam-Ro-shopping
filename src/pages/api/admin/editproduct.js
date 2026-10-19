import dbConnect from '@/src/lib/dbConnect';
import Product from '@/src/models/Product';
import { verifyAdminAccess } from '@/src/lib/authUtils';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const auth = await verifyAdminAccess(req, res);
  if (!auth.authorized) {
    return res.status(auth.status).json({ success: false, message: auth.message });
  }

  await dbConnect();
  try {
    const { id, ...editProduct } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const updated = await Product.findByIdAndUpdate(id, editProduct, { new: true })
      .populate({ path: 'category', select: 'name' });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, product: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
