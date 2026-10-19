/**
 * Payment Utilities - Helper functions for payment processing
 * Provides common utilities for payment handling, validation, and formatting
 */
import siteConfig from "../config/site";

/**
 * Payment method constants
 */
export const PAYMENT_METHODS = {
  COD: "cod",
  RAZORPAY: "razorpay",
  BANK_TRANSFER: "bank_transfer",
  UPI: "upi",
  CARD: "card",
  WALLET: "wallet",
};

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
};

/**
 * Order status constants
 */
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

/**
 * Format amount for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} Formatted amount
 */
export const formatAmount = (amount, currency = "₹") => {
  if (!amount || isNaN(amount)) return `${currency}0`;
  return `${currency}${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Convert amount to paise (for Razorpay)
 * @param {number} amount - Amount in rupees
 * @returns {number} Amount in paise
 */
export const convertToPaise = (amount) => {
  return Math.round(Number(amount) * 100);
};

/**
 * Convert amount from paise to rupees
 * @param {number} paise - Amount in paise
 * @returns {number} Amount in rupees
 */
export const convertFromPaise = (paise) => {
  return Number(paise) / 100;
};

/**
 * Validate payment method
 * @param {string} method - Payment method to validate
 * @returns {boolean} Is valid payment method
 */
export const isValidPaymentMethod = (method) => {
  return Object.values(PAYMENT_METHODS).includes(method);
};

/**
 * Validate payment status
 * @param {string} status - Payment status to validate
 * @returns {boolean} Is valid payment status
 */
export const isValidPaymentStatus = (status) => {
  return Object.values(PAYMENT_STATUS).includes(status);
};

/**
 * Generate unique receipt ID
 * @param {string} prefix - Prefix for receipt ID (default: 'RCPT')
 * @returns {string} Unique receipt ID
 */
export const generateReceiptId = (prefix = "RCPT") => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Generate unique order ID
 * @param {string} prefix - Prefix for order ID (default: 'ORD')
 * @returns {string} Unique order ID
 */
export const generateOrderId = (prefix = "ORD") => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Validate order data for payment processing
 * @param {Object} orderData - Order data to validate
 * @returns {Object} Validation result
 */
export const validateOrderData = (orderData) => {
  const errors = [];

  if (!orderData) {
    errors.push("Order data is required");
    return { isValid: false, errors };
  }

  const { user, items, totalAmount, shippingAddress, paymentMethod } =
    orderData;

  if (!user) errors.push("User information is required");
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push("Order items are required");
  }
  if (!totalAmount || totalAmount <= 0) {
    errors.push("Valid total amount is required");
  }
  if (!shippingAddress) errors.push("Shipping address is required");
  if (!paymentMethod || !isValidPaymentMethod(paymentMethod)) {
    errors.push("Valid payment method is required");
  }

  // Validate shipping address
  if (shippingAddress) {
    const { address, city, postalCode, country } = shippingAddress;
    if (!address) errors.push("Shipping address is required");
    if (!city) errors.push("City is required");
    if (!postalCode) errors.push("Postal code is required");
    if (!country) errors.push("Country is required");
  }

  // Validate items
  if (items && Array.isArray(items)) {
    items.forEach((item, index) => {
      if (!item.product)
        errors.push(`Product ID is required for item ${index + 1}`);
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Valid quantity is required for item ${index + 1}`);
      }
      if (!item.price || item.price <= 0) {
        errors.push(`Valid price is required for item ${index + 1}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate order total from items
 * @param {Array} items - Order items
 * @returns {number} Total amount
 */
export const calculateOrderTotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 0);
    return total + itemTotal;
  }, 0);
};

/**
 * Get payment method display name
 * @param {string} method - Payment method code
 * @returns {string} Display name
 */
export const getPaymentMethodDisplayName = (method) => {
  const displayNames = {
    [PAYMENT_METHODS.COD]: "Cash on Delivery",
    [PAYMENT_METHODS.RAZORPAY]: "Online Payment",
    [PAYMENT_METHODS.BANK_TRANSFER]: "Bank Transfer",
    [PAYMENT_METHODS.UPI]: "UPI Payment",
    [PAYMENT_METHODS.CARD]: "Card Payment",
    [PAYMENT_METHODS.WALLET]: "Wallet Payment",
  };

  return displayNames[method] || method;
};

/**
 * Get payment status display name and color
 * @param {string} status - Payment status
 * @returns {Object} Display info with name and color
 */
export const getPaymentStatusDisplay = (status) => {
  const statusInfo = {
    [PAYMENT_STATUS.PENDING]: { name: "Pending", color: "yellow" },
    [PAYMENT_STATUS.PROCESSING]: { name: "Processing", color: "blue" },
    [PAYMENT_STATUS.COMPLETED]: { name: "Completed", color: "green" },
    [PAYMENT_STATUS.FAILED]: { name: "Failed", color: "red" },
    [PAYMENT_STATUS.REFUNDED]: { name: "Refunded", color: "purple" },
    [PAYMENT_STATUS.CANCELLED]: { name: "Cancelled", color: "gray" },
  };

  return statusInfo[status] || { name: status, color: "gray" };
};

/**
 * Check if payment method requires online processing
 * @param {string} method - Payment method
 * @returns {boolean} Requires online processing
 */
export const requiresOnlineProcessing = (method) => {
  const onlineMethods = [
    PAYMENT_METHODS.RAZORPAY,
    PAYMENT_METHODS.UPI,
    PAYMENT_METHODS.CARD,
    PAYMENT_METHODS.WALLET,
  ];

  return onlineMethods.includes(method);
};

/**
 * Sanitize payment data for logging (remove sensitive info)
 * @param {Object} paymentData - Payment data to sanitize
 * @returns {Object} Sanitized data
 */
export const sanitizePaymentData = (paymentData) => {
  const sensitiveFields = [
    "razorpay_signature",
    "key_secret",
    "card_number",
    "cvv",
  ];
  const sanitized = { ...paymentData };

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = "***HIDDEN***";
    }
  });

  return sanitized;
};

/**
 * Create Razorpay options for frontend
 * @param {Object} orderData - Order data
 * @param {Object} razorpayOrder - Razorpay order object
 * @param {Object} userInfo - User information
 * @returns {Object} Razorpay options
 */
export const createRazorpayOptions = (orderData, razorpayOrder, userInfo) => {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || siteConfig.name || "Shyam RO",
    description: `Order payment for ${orderData.items?.length || 0} items`,
    order_id: razorpayOrder.id,
    
    // Simple method configuration - let Razorpay show all available methods
    method: {
      upi: true,
      card: true,
      netbanking: true,
      wallet: true
    },
    
    prefill: {
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      contact: userInfo?.phone || "",
    },
    
    notes: {
      order_id: orderData.orderId || "",
      user_id: userInfo?.id || userInfo?._id || "",
    },
    
    theme: {
      color: "#3B82F6", // Blue theme
    },
    
    // Enable international payments
    accept_international: true,
    
    // Simple modal configuration
    modal: {
      ondismiss: function() {
        console.log('Payment modal closed');
      }
    }
  };
};
