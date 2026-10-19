import connectDB from '@/src/lib/dbConnect';
import Payment from '@/src/models/Payment';
import Order from '@/src/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { parse } from 'cookie';

/**
 * API endpoint to get user's payment history
 * GET /api/customer/payments
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    await connectDB();
    
    // Get user session for authentication
    const session = await getServerSession(req, res, authOptions);
    let userId = session?.user?.id;

    if (!userId) {
      const cookies = parse(req.headers.cookie || '');
      if (cookies.customUser) {
        try {
          const parsed = JSON.parse(cookies.customUser);
          userId = parsed.id;
        } catch (e) {}
      }
    }
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const { page = 1, limit = 10, status, paymentMethod } = req.query;
    
    // Build query filters
    const query = { userId };
    
    if (status) {
      query.paymentStatus = status;
    }
    
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch payments with pagination
    const payments = await Payment.find(query)
      .populate('orderId', 'orderId items totalAmount status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    // Get total count for pagination
    const totalCount = await Payment.countDocuments(query);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit)) || 1;
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    // Get payment statistics safely
    let stats = null;
    if (typeof Payment.getPaymentStats === 'function') {
      try {
        stats = await Payment.getPaymentStats(userId);
      } catch (statErr) {
        stats = null;
      }
    }
    
    return res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        },
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
