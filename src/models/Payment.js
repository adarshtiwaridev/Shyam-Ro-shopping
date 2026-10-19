import mongoose from "mongoose";

/**
 * Payment Schema - Dedicated table for payment records
 * Tracks all payment transactions separately from orders
 */
const PaymentSchema = new mongoose.Schema(
  {
    // Payment Identifiers
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true, // Allow null for COD payments
    },
    razorpayOrderId: {
      type: String,
      sparse: true, // Allow null for COD payments
    },
    razorpaySignature: {
      type: String,
      sparse: true, // Allow null for COD payments
    },

    // Order Reference
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },

    // User Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Payment Details
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod", "upi", "card", "netbanking", "wallet"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded", "cancelled"],
      default: "pending",
      required: true,
    },

    // Payment Gateway Details
    gateway: {
      type: String,
      enum: ["razorpay", "manual", "cod"],
      default: "razorpay",
    },
    gatewayTransactionId: {
      type: String,
      sparse: true,
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed, // Store full gateway response
    },

    // Payment Verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    verificationMethod: {
      type: String,
      enum: ["signature", "webhook", "manual"],
    },

    // Refund Information
    refunds: [
      {
        refundId: String,
        amount: Number,
        reason: String,
        status: {
          type: String,
          enum: ["pending", "processed", "failed"],
        },
        processedAt: Date,
        refundTransactionId: String,
      },
    ],
    totalRefunded: {
      type: Number,
      default: 0,
    },

    // Payment Attempts
    attempts: [
      {
        attemptedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["initiated", "processing", "completed", "failed"],
        },
        errorMessage: String,
        gatewayResponse: mongoose.Schema.Types.Mixed,
      },
    ],

    // Additional Information
    receiptId: {
      type: String,
      required: true,
    },
    description: String,
    notes: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Timestamps
    initiatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    failedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ paymentStatus: 1 });
PaymentSchema.index({ createdAt: -1 });

// Virtual for payment age
PaymentSchema.virtual("paymentAge").get(function () {
  return Date.now() - this.createdAt;
});

// Virtual for net amount (amount - refunds)
PaymentSchema.virtual("netAmount").get(function () {
  return this.amount - this.totalRefunded;
});

// Methods
PaymentSchema.methods.markAsCompleted = function () {
  this.paymentStatus = "completed";
  this.completedAt = new Date();
  this.isVerified = true;
  this.verifiedAt = new Date();
  return this.save();
};

PaymentSchema.methods.markAsFailed = function (errorMessage) {
  this.paymentStatus = "failed";
  this.failedAt = new Date();
  if (errorMessage) {
    this.attempts.push({
      status: "failed",
      errorMessage: errorMessage,
    });
  }
  return this.save();
};

PaymentSchema.methods.addRefund = function (refundData) {
  this.refunds.push(refundData);
  this.totalRefunded += refundData.amount;
  if (this.totalRefunded >= this.amount) {
    this.paymentStatus = "refunded";
  }
  return this.save();
};

// Static methods
PaymentSchema.statics.findByOrderId = function (orderId) {
  return this.find({ orderId }).populate("userId", "name email").sort({ createdAt: -1 });
};

PaymentSchema.statics.findByUserId = function (userId) {
  return this.find({ userId }).populate("orderId").sort({ createdAt: -1 });
};

PaymentSchema.statics.getPaymentStats = function (userId = null) {
  const match = userId ? { userId } : {};
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$paymentStatus",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
};

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
