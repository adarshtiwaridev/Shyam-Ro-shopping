import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Razorpay Service - Modular payment gateway integration
 * Handles order creation, payment verification, and error handling
 */
class RazorpayService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Create a Razorpay order
   * @param {Object} orderData - Order details
   * @param {number} orderData.amount - Amount in paise (multiply by 100)
   * @param {string} orderData.currency - Currency code (default: INR)
   * @param {string} orderData.receipt - Unique receipt ID
   * @param {Object} orderData.notes - Additional notes
   * @returns {Promise<Object>} Razorpay order object
   */
  async createOrder(orderData) {
    try {
      const { amount, currency = "INR", receipt, notes = {} } = orderData;

      if (!amount || amount <= 0) {
        throw new Error("Invalid amount provided");
      }

      if (!receipt) {
        throw new Error("Receipt ID is required");
      }

      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt,
        notes,
        payment_capture: 1, // Auto capture payment
      };

      const order = await this.razorpay.orders.create(options);

      return {
        success: true,
        order,
        error: null,
      };
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      return {
        success: false,
        order: null,
        error: error.message || "Failed to create payment order",
      };
    }
  }

  /**
   * Verify payment signature
   * @param {Object} paymentData - Payment verification data
   * @param {string} paymentData.razorpay_order_id - Razorpay order ID
   * @param {string} paymentData.razorpay_payment_id - Razorpay payment ID
   * @param {string} paymentData.razorpay_signature - Payment signature
   * @returns {Object} Verification result
   */
  verifyPayment(paymentData) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        paymentData;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new Error("Missing required payment verification parameters");
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      const isSignatureValid = expectedSignature === razorpay_signature;

      return {
        success: true,
        isValid: isSignatureValid,
        error: null,
      };
    } catch (error) {
      console.error("Payment verification failed:", error);
      return {
        success: false,
        isValid: false,
        error: error.message || "Payment verification failed",
      };
    }
  }

  /**
   * Fetch payment details from Razorpay
   * @param {string} paymentId - Razorpay payment ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentDetails(paymentId) {
    try {
      if (!paymentId) {
        throw new Error("Payment ID is required");
      }

      const payment = await this.razorpay.payments.fetch(paymentId);

      return {
        success: true,
        payment,
        error: null,
      };
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
      return {
        success: false,
        payment: null,
        error: error.message || "Failed to fetch payment details",
      };
    }
  }

  /**
   * Refund a payment
   * @param {string} paymentId - Razorpay payment ID
   * @param {number} amount - Refund amount in paise (optional, full refund if not provided)
   * @param {Object} notes - Additional notes for refund
   * @returns {Promise<Object>} Refund result
   */
  async refundPayment(paymentId, amount = null, notes = {}) {
    try {
      if (!paymentId) {
        throw new Error("Payment ID is required");
      }

      const refundData = {
        notes,
      };

      if (amount && amount > 0) {
        refundData.amount = Math.round(amount * 100); // Convert to paise
      }

      const refund = await this.razorpay.payments.refund(paymentId, refundData);

      return {
        success: true,
        refund,
        error: null,
      };
    } catch (error) {
      console.error("Payment refund failed:", error);
      return {
        success: false,
        refund: null,
        error: error.message || "Payment refund failed",
      };
    }
  }

  /**
   * Get order details from Razorpay
   * @param {string} orderId - Razorpay order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderDetails(orderId) {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const order = await this.razorpay.orders.fetch(orderId);

      return {
        success: true,
        order,
        error: null,
      };
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      return {
        success: false,
        order: null,
        error: error.message || "Failed to fetch order details",
      };
    }
  }

  /**
   * Validate Razorpay configuration
   * @returns {Object} Configuration validation result
   */
  validateConfig() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return {
        isValid: false,
        error:
          "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.",
      };
    }

    if (keyId.length < 10 || keySecret.length < 10) {
      return {
        isValid: false,
        error: "Invalid Razorpay credentials format.",
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }
}

// Export singleton instance
const razorpayService = new RazorpayService();
export default razorpayService;

// Export class for testing purposes
export { RazorpayService };
