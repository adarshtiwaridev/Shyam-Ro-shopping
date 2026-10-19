import connectDB from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';
import Payment from '@/src/models/Payment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import users from '@/src/models/users';
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // 1. Check NextAuth Session
    let sessionUser = null;
    const session = await getServerSession(req, res, authOptions);
    if (session && session.user) {
      sessionUser = session.user;
    }

    // 2. Check Custom Cookie if NextAuth session not present
    if (!sessionUser) {
      const cookies = parse(req.headers.cookie || '');
      if (cookies.customUser) {
        try {
          sessionUser = JSON.parse(cookies.customUser);
        } catch (e) {
          sessionUser = null;
        }
      }
    }

    let orders = [];

    if (sessionUser && (sessionUser.email || sessionUser.id)) {
      const dbUser = sessionUser.id
        ? await users.findById(sessionUser.id)
        : await users.findOne({ email: sessionUser.email });

      if (dbUser && (dbUser.role === 'admin' || dbUser.role === 'microadmin')) {
        // Admin or Microadmin can see all orders
        orders = await Order.find()
          .populate('user', 'firstName lastName email name')
          .populate('items.product', 'name price images')
          .sort({ createdAt: -1 });
      } else if (dbUser) {
        // Regular customer sees only their orders
        orders = await Order.find({ user: dbUser._id })
          .populate('user', 'firstName lastName email name')
          .populate('items.product', 'name price images')
          .sort({ createdAt: -1 });
      }
    }

    // Attach latest payment information for each order
    const ordersWithPayments = await Promise.all(
      orders.map(async (order) => {
        const payments = await Payment.find({ orderId: order._id })
          .sort({ createdAt: -1 })
          .limit(1);

        return {
          ...order.toObject(),
          latestPayment: payments[0] || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      orders: ordersWithPayments,
      count: ordersWithPayments.length,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
}