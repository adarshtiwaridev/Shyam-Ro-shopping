const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, unique: true, required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], 
        default: 'pending' 
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: { 
        type: String, 
        enum: ['cod', 'razorpay', 'bank_transfer', 'upi', 'card', 'wallet'],
        required: true 
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
        default: 'pending'
    },
    // Razorpay specific fields
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    transactionId: { type: String },
    receiptId: { type: String },
    
    // Payment tracking
    paymentAttempts: [{
        attemptedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['initiated', 'failed', 'success'] },
        failureReason: { type: String },
        paymentId: { type: String },
        amount: { type: Number }
    }],
    
    // Refund tracking
    refunds: [{
        refundId: { type: String },
        amount: { type: Number },
        reason: { type: String },
        status: { type: String, enum: ['pending', 'processed', 'failed'] },
        processedAt: { type: Date },
        createdAt: { type: Date, default: Date.now }
    }],
    
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    
    // Additional metadata
    notes: { type: String },
    adminNotes: { type: String }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);