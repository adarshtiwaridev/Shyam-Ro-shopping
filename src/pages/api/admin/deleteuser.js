import connectDB from '@/src/lib/dbConnect';
import User from '@/src/models/users';
import { verifyAdminAccess } from '@/src/lib/authUtils';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Authorize admin only for deletion
  const auth = await verifyAdminAccess(req, res);
  if (!auth.authorized) {
    return res.status(auth.status).json({ success: false, message: auth.message });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, message: 'User id is required' });
  }

  try {
    await connectDB();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
}