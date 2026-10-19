import connectDB from '@/src/lib/dbConnect';
import User from '@/src/models/users';
import { verifyAdminAccess } from '@/src/lib/authUtils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Only authorized admins can update user roles
  const auth = await verifyAdminAccess(req, res);
  if (!auth.authorized) {
    return res.status(auth.status).json({ success: false, message: auth.message });
  }

  const { userId, newRole } = req.body;
  if (!userId || !newRole) {
    return res.status(400).json({ success: false, message: 'userId and newRole are required' });
  }

  const validRoles = ['admin', 'microadmin', 'customer'];
  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ success: false, message: 'Invalid role specified' });
  }

  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.role = newRole;
    await user.save();
    return res.status(200).json({ success: true, message: 'User role updated successfully', user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user role', error: error.message });
  }
}