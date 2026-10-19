import razorpayService from '@/src/lib/razorpayService';
import { PAYMENT_STATUS, ORDER_STATUS } from '@/src/lib/paymentUtils';
import connectDB from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';

/**
 * API endpoint to refund Razorpay payment
 * POST /api/payment/refund-razorpay-payment
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { 
      orderDbId, 
      refundAmount, 
      refundReason = 'Customer requested refund',
      adminNotes = ''
    } = req.body;

    // Validate required fields
    if (!orderDbId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    await connectDB();

    // Find the order in database
    const order = await Order.findById(orderDbId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order has a valid payment to refund
    if (!order.razorpayPaymentId || order.paymentStatus !== PAYMENT_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: 'No valid payment found for refund'
      });
    }

    // Check if refund amount is valid
    const maxRefundAmount = order.totalAmount;
    const currentRefunds = order.refunds || [];
    const totalRefunded = currentRefunds
      .filter(refund => refund.status === 'processed')
      .reduce((sum, refund) => sum + refund.amount, 0);
    
    const availableForRefund = maxRefundAmount - totalRefunded;
    const requestedRefundAmount = refundAmount || availableForRefund;

    if (requestedRefundAmount <= 0 || requestedRefundAmount > availableForRefund) {
      return res.status(400).json({
        success: false,
        message: `Invalid refund amount. Available for refund: ₹${availableForRefund}`
      });
    }

    // Process refund with Razorpay
    const refundResult = await razorpayService.refundPayment(
      order.razorpayPaymentId,
      requestedRefundAmount,
      {
        reason: refundReason,
        order_id: order.orderId
      }
    );

    if (!refundResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to process refund',
        error: refundResult.error
      });
    }

    // Update order with refund information
    const refundData = {
      refundId: refundResult.refund.id,
      amount: requestedRefundAmount,
      reason: refundReason,
      status: 'processed',
      processedAt: new Date(),
      createdAt: new Date()
    };

    const updateData = {
      $push: {
        refunds: refundData
      },
      adminNotes: adminNotes ? `${order.adminNotes || ''}\n${adminNotes}`.trim() : order.adminNotes
    };

    // Update payment and order status if full refund
    const newTotalRefunded = totalRefunded + requestedRefundAmount;
    if (newTotalRefunded >= maxRefundAmount) {
      updateData.paymentStatus = PAYMENT_STATUS.REFUNDED;
      updateData.status = ORDER_STATUS.REFUNDED;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderDbId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refundResult.refund.id,
        orderId: updatedOrder.orderId,
        refundAmount: requestedRefundAmount,
        totalRefunded: newTotalRefunded,
        remainingAmount: maxRefundAmount - newTotalRefunded,
        refundStatus: 'processed',
        orderStatus: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus
      }
    });

  } catch (error) {
    console.error('Payment refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during refund processing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
