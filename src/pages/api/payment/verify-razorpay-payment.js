import razorpayService from '@/src/lib/razorpayService';
import { PAYMENT_STATUS, ORDER_STATUS, generateReceiptId } from '@/src/lib/paymentUtils';
import connectDB from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';
import Payment from '@/src/models/Payment';

/**
 * API endpoint to verify Razorpay payment
 * POST /api/payment/verify-razorpay-payment
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
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderDbId 
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderDbId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters'
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

    // Verify that the Razorpay order ID matches
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID mismatch'
      });
    }

    // Verify payment signature
    const verificationResult = razorpayService.verifyPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!verificationResult.success) {
      // Update order with failed payment attempt
      await Order.findByIdAndUpdate(orderDbId, {
        $push: {
          paymentAttempts: {
            attemptedAt: new Date(),
            status: 'failed',
            failureReason: verificationResult.error,
            paymentId: razorpay_payment_id,
            amount: order.totalAmount
          }
        }
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: verificationResult.error
      });
    }

    if (!verificationResult.isValid) {
      // Update order with failed payment attempt
      await Order.findByIdAndUpdate(orderDbId, {
        $push: {
          paymentAttempts: {
            attemptedAt: new Date(),
            status: 'failed',
            failureReason: 'Invalid payment signature',
            paymentId: razorpay_payment_id,
            amount: order.totalAmount
          }
        },
        paymentStatus: PAYMENT_STATUS.FAILED
      });

      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed'
      });
    }

    // Get payment details from Razorpay
    const paymentDetails = await razorpayService.getPaymentDetails(razorpay_payment_id);
    
    // Create Payment record
    const paymentRecord = new Payment({
      paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      orderId: order._id,
      orderNumber: order.orderId,
      userId: order.user,
      amount: order.totalAmount,
      currency: 'INR',
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      gateway: 'razorpay',
      gatewayTransactionId: razorpay_payment_id,
      gatewayResponse: paymentDetails.success ? paymentDetails.payment : null,
      isVerified: true,
      verifiedAt: new Date(),
      verificationMethod: 'signature',
      receiptId: order.receiptId || generateReceiptId('RCPT'),
      description: `Payment for order ${order.orderId}`,
      notes: {
        orderItems: order.items.length,
        verifiedAt: new Date().toISOString()
      },
      attempts: [{
        attemptedAt: new Date(),
        status: 'completed',
        gatewayResponse: paymentDetails.success ? paymentDetails.payment : null
      }],
      completedAt: new Date()
    });

    await paymentRecord.save();
    
    // Update order with successful payment
    const updateData = {
      paymentStatus: PAYMENT_STATUS.COMPLETED,
      status: ORDER_STATUS.CONFIRMED,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      transactionId: razorpay_payment_id,
      paidAt: new Date(),
      $push: {
        paymentAttempts: {
          attemptedAt: new Date(),
          status: 'success',
          paymentId: razorpay_payment_id,
          amount: order.totalAmount
        }
      }
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      orderDbId, 
      updateData, 
      { new: true }
    );

    // Prepare response data
    const responseData = {
      orderId: updatedOrder.orderId,
      orderDbId: updatedOrder._id,
      paymentId: razorpay_payment_id,
      transactionId: razorpay_payment_id,
      amount: updatedOrder.totalAmount,
      status: updatedOrder.status,
      paymentStatus: updatedOrder.paymentStatus,
      paidAt: updatedOrder.paidAt
    };

    // Include payment details if available
    if (paymentDetails.success && paymentDetails.payment) {
      responseData.paymentMethod = paymentDetails.payment.method;
      responseData.paymentBank = paymentDetails.payment.bank;
      responseData.paymentWallet = paymentDetails.payment.wallet;
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Try to update order with error status if orderDbId is available
    if (req.body.orderDbId) {
      try {
        await Order.findByIdAndUpdate(req.body.orderDbId, {
          $push: {
            paymentAttempts: {
              attemptedAt: new Date(),
              status: 'failed',
              failureReason: 'Server error during verification',
              paymentId: req.body.razorpay_payment_id,
              amount: 0
            }
          }
        });
      } catch (updateError) {
        console.error('Failed to update order with error status:', updateError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during payment verification',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
