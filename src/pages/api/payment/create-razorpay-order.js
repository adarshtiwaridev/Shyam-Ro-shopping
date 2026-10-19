import razorpayService from '@/src/lib/razorpayService';
import { validateOrderData, generateReceiptId, PAYMENT_METHODS, PAYMENT_STATUS, ORDER_STATUS } from '@/src/lib/paymentUtils';
import connectDB from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';
import Payment from '@/src/models/Payment';

/**
 * API endpoint to create a Razorpay order
 * POST /api/payment/create-razorpay-order
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Validate Razorpay configuration
    const configValidation = razorpayService.validateConfig();
    if (!configValidation.isValid) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway configuration error',
        error: configValidation.error
      });
    }

    const { orderData } = req.body;

    if (!orderData) {
      return res.status(400).json({
        success: false,
        message: 'Order data is required'
      });
    }

    // Validate order data
    const validation = validateOrderData(orderData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order data',
        errors: validation.errors
      });
    }

    // Ensure payment method is Razorpay
    if (orderData.paymentMethod !== PAYMENT_METHODS.RAZORPAY) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method for Razorpay order creation'
      });
    }

    await connectDB();

    // Generate unique receipt ID
    const receiptId = generateReceiptId('RCPT');
    
    // Create Razorpay order
    const razorpayOrderData = {
      amount: orderData.totalAmount,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        user_id: orderData.user,
        order_items: orderData.items.length,
        custom_order: orderData.isCustomOrder || false
      }
    };

    const razorpayResult = await razorpayService.createOrder(razorpayOrderData);

    if (!razorpayResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: razorpayResult.error
      });
    }

    // Create pending order in database
    const newOrder = new Order({
      user: orderData.user,
      orderId: orderData.orderId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: PAYMENT_METHODS.RAZORPAY,
      paymentStatus: 'pending',
      status: 'pending',
      razorpayOrderId: razorpayResult.order.id,
      receiptId: receiptId,
      paymentAttempts: [{
        attemptedAt: new Date(),
        status: 'initiated',
        amount: orderData.totalAmount
      }],
      notes: orderData.notes || ''
    });

    // Save order to database
    const savedOrder = await newOrder.save();
    
    // Create initial Payment record
    const paymentRecord = new Payment({
      paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      razorpayOrderId: razorpayResult.order.id,
      orderId: savedOrder._id,
      orderNumber: savedOrder.orderId,
      userId: savedOrder.user,
      amount: savedOrder.totalAmount,
      currency: 'INR',
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      gateway: 'razorpay',
      receiptId: receiptId,
      description: `Payment for order ${savedOrder.orderId}`,
      notes: {
        orderItems: savedOrder.items.length,
        initiatedAt: new Date().toISOString()
      },
      attempts: [{
        attemptedAt: new Date(),
        status: 'initiated'
      }]
    });

    await paymentRecord.save();
    
    console.log('Order and payment record saved successfully:', {
      orderId: savedOrder.orderId,
      dbId: savedOrder._id,
      paymentId: paymentRecord.paymentId,
      amount: savedOrder.totalAmount,
      razorpayOrderId: razorpayResult.order.id
    });

    // Return success response with Razorpay order details
    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        razorpayOrder: razorpayResult.order,
        orderId: savedOrder.orderId,
        orderDbId: savedOrder._id,
        receiptId: receiptId,
        amount: orderData.totalAmount,
        currency: 'INR',
        paymentId: paymentRecord.paymentId
      }
    });

  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
