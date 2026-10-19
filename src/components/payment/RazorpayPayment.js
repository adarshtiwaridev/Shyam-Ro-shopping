import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { formatAmount, createRazorpayOptions } from "@/src/lib/paymentUtils";

/**
 * RazorpayPayment Component
 * Handles Razorpay payment integration with proper error handling and loading states
 */
const RazorpayPayment = ({
  orderData,
  userInfo,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
  className = "",
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          setRazorpayLoaded(false);
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  /**
   * Handle payment initiation
   */
  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway not loaded. Please refresh and try again.");
      return;
    }

    if (!orderData || !userInfo) {
      toast.error("Missing order or user information");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // Create Razorpay order
      const response = await fetch("/api/payment/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderData }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create payment order");
      }

      const { razorpayOrder, orderDbId, receiptId } = result.data;

      // Create Razorpay options
      const options = {
        ...createRazorpayOptions(orderData, razorpayOrder, userInfo),
        handler: async (response) => {
          await handlePaymentSuccess(response, orderDbId);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentStatus("idle");
            toast.error("Payment cancelled");
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        handlePaymentFailure(response, orderDbId);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      setIsProcessing(false);
      setPaymentStatus("error");
      toast.error(error.message || "Failed to initiate payment");

      if (onPaymentError) {
        onPaymentError(error);
      }
    }
  };

  /**
   * Handle successful payment
   */
  const handlePaymentSuccess = async (response, orderDbId) => {
    try {
      setPaymentStatus("processing");

      // Verify payment with backend
      const verifyResponse = await fetch(
        "/api/payment/verify-razorpay-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderDbId: orderDbId,
          }),
        }
      );

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.success) {
        throw new Error(verifyResult.message || "Payment verification failed");
      }

      setPaymentStatus("success");
      toast.success("Payment successful! Your order has been confirmed.");

      if (onPaymentSuccess) {
        onPaymentSuccess(verifyResult.data);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentStatus("error");
      toast.error(error.message || "Payment verification failed");

      if (onPaymentError) {
        onPaymentError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle payment failure
   */
  const handlePaymentFailure = (response, orderDbId) => {
    console.error("Payment failed:", response);
    setIsProcessing(false);
    setPaymentStatus("error");

    const errorMessage = response.error?.description || "Payment failed";
    toast.error(errorMessage);

    if (onPaymentError) {
      onPaymentError(new Error(errorMessage));
    }
  };

  /**
   * Get button content based on status
   */
  const getButtonContent = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Payment Successful
          </>
        );
      case "error":
        return (
          <>
            <XCircle className="w-4 h-4 mr-2" />
            Payment Failed
          </>
        );
      default:
        return (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay {formatAmount(orderData?.totalAmount)}
          </>
        );
    }
  };

  /**
   * Get button styling based on status
   */
  const getButtonStyling = () => {
    switch (paymentStatus) {
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "error":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  if (!razorpayLoaded) {
    return (
      <Card className="p-4">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-gray-600">Loading payment gateway...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`razorpay-payment-container ${className}`}>
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  Secure Online Payment
                </h3>
                <p className="text-sm text-blue-600">
                  Pay securely with cards, UPI, wallets & more
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-800">
                {formatAmount(orderData?.totalAmount)}
              </p>
              <p className="text-xs text-blue-600">Total Amount</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4 text-xs text-gray-500">
            <span>Powered by</span>
            <img
              src="https://razorpay.com/assets/razorpay-logo.svg"
              alt="Razorpay"
              className="h-4"
            />
          </div>

          <Button
            onClick={handlePayment}
            disabled={disabled || isProcessing || paymentStatus === "success"}
            className={`w-full py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 ${getButtonStyling()}`}
          >
            {getButtonContent()}
          </Button>

          {paymentStatus === "error" && (
            <Button
              onClick={() => {
                setPaymentStatus("idle");
                handlePayment();
              }}
              variant="outline"
              className="w-full mt-3 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Retry Payment
            </Button>
          )}

          <div className="mt-4 text-xs text-center text-gray-500">
            <p>🔒 Your payment information is secure and encrypted</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RazorpayPayment;
