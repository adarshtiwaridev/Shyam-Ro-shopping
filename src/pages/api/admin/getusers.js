import connectDB from '@/src/lib/dbConnect';
import User from '@/src/models/users';
import { verifyAdminAccess } from '@/src/lib/authUtils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Authorize admin or microadmin
  const auth = await verifyAdminAccess(req, res);
  if (!auth.authorized) {
    return res.status(auth.status).json({ success: false, message: auth.message });
  }

  try {
    await connectDB();
    const searchedRole = req.query.role;
    const query = searchedRole ? { role: searchedRole } : {};
    const users = await User.find(query, '-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
}