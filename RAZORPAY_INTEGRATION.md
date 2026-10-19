# Razorpay Integration Documentation

## Overview

This document provides comprehensive information about the Razorpay payment gateway integration in the RoSite e-commerce application. The integration is designed to be modular, robust, and bug-free with proper error handling and security measures.

## Features

✅ **Modular Architecture**: Clean separation of concerns with dedicated service classes and utilities
✅ **Multiple Payment Methods**: Support for both Cash on Delivery (COD) and Razorpay online payments
✅ **Secure Payment Processing**: Proper signature verification and encryption
✅ **Comprehensive Error Handling**: Robust error handling with user-friendly messages
✅ **Payment Tracking**: Complete payment attempt and refund tracking
✅ **Responsive UI**: Modern, mobile-friendly payment interface
✅ **Order Management**: Enhanced order model with payment status tracking

## Architecture

### Core Components

1. **RazorpayService** (`/src/lib/razorpayService.js`)
   - Handles all Razorpay API interactions
   - Order creation, payment verification, refunds
   - Configuration validation and error handling

2. **Payment Utils** (`/src/lib/paymentUtils.js`)
   - Common payment utilities and constants
   - Amount formatting, validation functions
   - Payment method and status helpers

3. **API Endpoints** (`/src/pages/api/payment/`)
   - `create-razorpay-order.js`: Creates Razorpay orders
   - `verify-razorpay-payment.js`: Verifies payment signatures
   - `refund-razorpay-payment.js`: Processes refunds

4. **UI Components**
   - `RazorpayPayment.js`: React component for payment processing
   - Updated billing page with payment method selection

5. **Enhanced Models**
   - Updated Order model with Razorpay fields and payment tracking

## Environment Configuration

Add the following environment variables to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend Configuration (for Next.js public variables)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_COMPANY_NAME=RoSite

# Optional: For development/testing
NODE_ENV=development
```

### Getting Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Generate API keys for your account
4. Use Test keys for development and Live keys for production

## Installation

The integration has already been set up with the following dependencies:

```bash
npm install razorpay
```

## Usage

### 1. Basic Payment Flow

The payment flow supports two methods:

#### Cash on Delivery (COD)
- User selects COD payment method
- Order is created immediately with "confirmed" status
- Payment status remains "pending" until delivery

#### Online Payment (Razorpay)
- User selects online payment method
- Razorpay order is created via API
- User completes payment through Razorpay checkout
- Payment is verified and order is confirmed

### 2. API Endpoints Usage

#### Create Razorpay Order
```javascript
POST /api/payment/create-razorpay-order
Content-Type: application/json

{
  "orderData": {
    "user": "user_id",
    "orderId": "unique_order_id",
    "items": [...],
    "totalAmount": 1000,
    "shippingAddress": {...},
    "paymentMethod": "razorpay"
  }
}
```

#### Verify Payment
```javascript
POST /api/payment/verify-razorpay-payment
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "orderDbId": "mongodb_order_id"
}
```

#### Process Refund
```javascript
POST /api/payment/refund-razorpay-payment
Content-Type: application/json

{
  "orderDbId": "mongodb_order_id",
  "refundAmount": 500, // Optional, full refund if not provided
  "refundReason": "Customer requested refund",
  "adminNotes": "Approved by admin"
}
```

### 3. Frontend Integration

#### Using RazorpayPayment Component
```jsx
import RazorpayPayment from '@/components/payment/RazorpayPayment';

<RazorpayPayment
  orderData={{
    user: userId,
    orderId: uniqueOrderId,
    items: orderItems,
    totalAmount: totalAmount,
    shippingAddress: shippingAddress,
    paymentMethod: 'razorpay'
  }}
  userInfo={{
    id: userId,
    name: userName,
    email: userEmail,
    phone: userPhone
  }}
  onPaymentSuccess={(paymentData) => {
    // Handle successful payment
    console.log('Payment successful:', paymentData);
  }}
  onPaymentError={(error) => {
    // Handle payment error
    console.error('Payment failed:', error);
  }}
  disabled={false}
/>
```

## Database Schema

### Enhanced Order Model

The Order model has been updated to support comprehensive payment tracking:

```javascript
{
  // Basic order fields
  user: ObjectId,
  orderId: String (unique),
  items: [...],
  totalAmount: Number,
  status: String, // pending, confirmed, processing, shipped, delivered, cancelled, refunded
  shippingAddress: {...},
  
  // Payment fields
  paymentMethod: String, // cod, razorpay, bank_transfer, upi, card, wallet
  paymentStatus: String, // pending, processing, completed, failed, refunded, cancelled
  
  // Razorpay specific fields
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  transactionId: String,
  receiptId: String,
  
  // Payment tracking
  paymentAttempts: [{
    attemptedAt: Date,
    status: String, // initiated, failed, success
    failureReason: String,
    paymentId: String,
    amount: Number
  }],
  
  // Refund tracking
  refunds: [{
    refundId: String,
    amount: Number,
    reason: String,
    status: String, // pending, processed, failed
    processedAt: Date,
    createdAt: Date
  }],
  
  // Timestamps
  paidAt: Date,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Additional metadata
  notes: String,
  adminNotes: String
}
```

## Security Features

1. **Signature Verification**: All payments are verified using HMAC SHA256 signatures
2. **Environment Variables**: Sensitive credentials stored in environment variables
3. **Input Validation**: Comprehensive validation of all input data
4. **Error Sanitization**: Sensitive information removed from error logs
5. **HTTPS Only**: Payment processing only works over HTTPS in production

## Error Handling

The integration includes comprehensive error handling:

### API Level Errors
- Configuration validation errors
- Payment gateway communication errors
- Database operation errors
- Signature verification failures

### Frontend Errors
- Network connectivity issues
- Payment cancellation by user
- Invalid form data
- Payment gateway loading failures

### Error Response Format
```javascript
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Technical error details (development only)",
  "errors": ["Validation error array"] // For validation errors
}
```

## Testing

### Test Mode Configuration
1. Use Razorpay test API keys in development
2. Test with different payment methods
3. Test payment failures and cancellations
4. Verify refund functionality

### Test Cards
Razorpay provides test cards for different scenarios:
- Success: 4111111111111111
- Failure: 4000000000000002
- Insufficient funds: 4000000000009995

## Monitoring and Logging

### Payment Tracking
- All payment attempts are logged in the database
- Failed payments include failure reasons
- Successful payments include transaction details

### Refund Tracking
- Complete refund history maintained
- Refund status tracking (pending, processed, failed)
- Admin notes for refund reasons

## Production Deployment

### Checklist
- [ ] Replace test API keys with live keys
- [ ] Ensure HTTPS is enabled
- [ ] Configure webhook endpoints (if needed)
- [ ] Set up monitoring and alerting
- [ ] Test payment flow end-to-end
- [ ] Configure backup payment methods

### Environment Variables for Production
```env
NODE_ENV=production
RAZORPAY_KEY_ID=your_live_key_id
RAZORPAY_KEY_SECRET=your_live_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_live_key_id
```

## Troubleshooting

### Common Issues

1. **Payment Gateway Not Loading**
   - Check internet connectivity
   - Verify Razorpay script is loading
   - Check browser console for errors

2. **Payment Verification Failed**
   - Verify API keys are correct
   - Check signature generation logic
   - Ensure order ID matches

3. **Order Not Created**
   - Check database connectivity
   - Verify order data validation
   - Check API endpoint responses

### Debug Mode
Set `NODE_ENV=development` to enable detailed error messages and logging.

## Support

For issues related to:
- **Razorpay API**: Contact Razorpay support
- **Integration Code**: Check this documentation or contact the development team
- **Order Management**: Check the admin dashboard

## Version History

- **v1.0.0**: Initial Razorpay integration with COD support
- **v1.0.1**: Added refund functionality and enhanced error handling
- **v1.0.2**: Improved UI/UX and payment tracking

---

**Note**: This integration is production-ready but should be thoroughly tested in your specific environment before going live.
