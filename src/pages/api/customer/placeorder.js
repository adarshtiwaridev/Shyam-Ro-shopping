import connectDB from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';
import User from '@/src/models/users';
import { validateOrderData, generateOrderId, PAYMENT_METHODS, PAYMENT_STATUS, ORDER_STATUS } from '@/src/lib/paymentUtils';

function padOrderNumber(num) {
  return num.toString().padStart(11, '0');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const orderData = req.body;
    
    // Validate order data
    const validation = validateOrderData(orderData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order data',
        errors: validation.errors
      });
    }

    const { user, items, totalAmount, shippingAddress, paymentMethod, notes, isCustomOrder } = orderData;

    await connectDB();

    // Generate unique order ID
    const orderId = generateOrderId('ORDEROXID');
    
    // Determine initial order status based on payment method
    let initialStatus = ORDER_STATUS.PENDING;
    let initialPaymentStatus = PAYMENT_STATUS.PENDING;
    
    // For COD orders, we can confirm them immediately
    if (paymentMethod === PAYMENT_METHODS.COD) {
      initialStatus = ORDER_STATUS.CONFIRMED;
      initialPaymentStatus = PAYMENT_STATUS.PENDING; // Will be completed on delivery
    }

    // Create order data
    const orderCreateData = {
      user,
      orderId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      status: initialStatus,
      notes: notes || ''
    };

    // Add custom order metadata if applicable
    if (isCustomOrder) {
      orderCreateData.notes = `${orderCreateData.notes} [Custom Order]`.trim();
    }

    const newOrder = await Order.create(orderCreateData);

    // Prepare response data
    const responseData = {
      orderId: newOrder.orderId,
      orderDbId: newOrder._id,
      status: newOrder.status,
      paymentStatus: newOrder.paymentStatus,
      paymentMethod: newOrder.paymentMethod,
      totalAmount: newOrder.totalAmount,
      createdAt: newOrder.createdAt
    };

    res.status(201).json({ 
      success: true,
      message: 'Order placed successfully', 
      data: responseData
    });

  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to place order', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
} 