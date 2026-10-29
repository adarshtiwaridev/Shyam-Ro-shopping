"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
 
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CreditCard, Banknote, Wallet, Smartphone, Shield } from "lucide-react";
import RazorpayPayment from "@/src/components/payment/RazorpayPayment";
import { PAYMENT_METHODS, formatAmount, generateOrderId } from "@/src/lib/paymentUtils";
import SEO from "@/src/components/SEO";
import siteConfig from "@/src/config/site";

export default function CheckoutPage() {

    const user = useSelector((state) => state.auth.user);
    const { cartItems } = useSelector((state) => state.cart);
    const router = useRouter();
    const skuid = router.query?.skuid;
    const allProducts = useSelector((state) => state.product.products);
 
    const [product, setProduct] = useState(null);
     const dispatch = useDispatch();

    useEffect(() => {
    const storedProduct = localStorage.getItem("specific-product");
    if (storedProduct) {
      try {
        const parsed = JSON.parse(storedProduct);
        setProduct(parsed);
      } catch (error) {
        console.error("Failed to parse localStorage product:", error);
      }
    }
  }, []);
  
  // If skuid is present, find the product
  let singleProduct = null;
  if (skuid) {
    singleProduct = allProducts.find((p) => p.skuid === skuid);
  }

  // If skuid, use that product, else use cart
  const recentproduct = skuid && singleProduct ? [singleProduct] : cartItems;
const total = recentproduct?.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) || 0;

  const customConfigParam = router.query?.custom;
  const [customConfig, setCustomConfig] = useState(null);

  useEffect(() => {
    if (customConfigParam === "1") {
      const storedConfig = localStorage.getItem("custom-ro-config");
      if (storedConfig) {
        try {
          setCustomConfig(JSON.parse(storedConfig));
        } catch (e) {
          setCustomConfig(null);
        }
      }
    }
  }, [customConfigParam]);
console.log("customConfig",customConfig)
  // If custom config, use that for order summary and placement
  const isCustomOrder = !!customConfig;
  const customProducts = isCustomOrder ? Object.values(customConfig.selectedComponents || {}) : [];
  console.log("customproduct",customProducts)
  const customTotal = isCustomOrder ? customConfig.finalPrice : total;

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS.COD);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderData, setPlacedOrderData] = useState(null);
  

  const validate = () => {
    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!postalCode) newErrors.postalCode = "Postal code is required";
    if (!recentproduct || recentproduct.length === 0) newErrors.items = "No items to order";
    if (!selectedPaymentMethod) newErrors.paymentMethod = "Payment method is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkouthandler = async () => {
    if (!validate()) return;
    
    // For Razorpay payments, we don't place the order here
    // The RazorpayPayment component will handle it
    if (selectedPaymentMethod === PAYMENT_METHODS.RAZORPAY) {
      return; // Let RazorpayPayment component handle this
    }
    
    // Handle COD orders
    setIsPlacingOrder(true);
    try {
      const itemsToOrder = isCustomOrder
        ? customProducts.map((item) => ({
            product: item._id,
            quantity: 1,
            price: item.price,
            name: item.name || item.title,
            image: item.image || item.images?.[0] || ''
          }))
        : recentproduct.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
            name: item.name || item.title,
            image: item.image || item.images?.[0] || ''
          }));

      const orderData = {
        user: user?._id || user?.id,
        orderId: generateOrderId('ORDEROXID'),
        items: itemsToOrder,
        totalAmount: isCustomOrder ? customTotal : total,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: selectedPaymentMethod,
        isCustomOrder: isCustomOrder,
        notes: isCustomOrder ? 'Custom RO system order' : '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Dispatch to Redux store immediately
      dispatch({
        type: 'orders/placeOrder',
        payload: orderData
      });

      const res = await fetch("/api/customer/placeorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        // Update Redux store with server response data
        if (data.data) {
          dispatch({
            type: 'orders/updateOrderStatus',
            payload: {
              id: orderData.orderId,
              status: 'confirmed',
              ...data.data
            }
          });
        }
        
        toast.success("Order placed successfully!");
        setOrderPlaced(true);
        setPlacedOrderData(data.data || orderData);
        
        // Clear localStorage for custom orders
        if (isCustomOrder) {
          localStorage.removeItem('custom-ro-config');
        }
        // Redirect to order confirmation or success page
        setTimeout(() => {
          router.push(`/dashboard`);
        }, 2000);
      } else {
        // Update Redux store with failed status
        dispatch({
          type: 'orders/updateOrderStatus',
          payload: {
            id: orderData.orderId,
            status: 'failed',
            error: data.message || 'Failed to place order'
          }
        });
        toast.error(data.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const isFormValid = country && address && city && postalCode && recentproduct && recentproduct.length > 0;

  return (
    <>
      <SEO
        title="Checkout & Billing"
        description="Securely complete your water purifier order."
        canonical="/customer/billingorder"
        noindex={true}
      />
      <div className="min-h-screen bg-white relative py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Billing Details */}
        <Card className="shadow-lg bg-white border border-gray-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 border-l-4 border-blue-600 pl-3">
              Billing details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-700">First Name</Label>
                <Input placeholder="Full name" value={user?.name || user?.firstName  +  user?.lastName} readOnly className="bg-white border-gray-300 text-black" /> 
              </div>
              <div>
                <Label className="text-gray-700 pb-1">Email</Label>
                <Input placeholder="Email" value={user?.email || ""} readOnly className="bg-white border-gray-300 text-black" /> 
              </div>
             
              <div className="sm:col-span-2">
                <Label className="text-gray-700 pb-1">Country / Region *</Label>
                <Input placeholder="e.g., India" className="bg-white border-gray-300 text-black" value={country} onChange={e => setCountry(e.target.value)} />
                {errors.country && <span className="text-red-500 text-xs">{errors.country}</span>}
              </div>
              <div className="sm:col-span-2">
                <Label className="text-gray-700 pb-1">Street address *</Label>
                <Input placeholder="House number and street name" className="bg-white border-gray-300 text-black" value={address} onChange={e => setAddress(e.target.value)} />
                {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}
              </div>
              <div className="sm:col-span-2 ">
                <Label className="text-gray-700 pb-1">Apartment, suite, etc. (optional)</Label>
                <Input placeholder="Apartment, suite, etc." className="bg-white border-gray-300 text-black" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-gray-700 pb-1">City *</Label>
                <Input placeholder="City" className="bg-white border-gray-300 text-black" value={city} onChange={e => setCity(e.target.value)} />
                {errors.city && <span className="text-red-500 text-xs">{errors.city}</span>}
              </div>
              <div className="sm:col-span-2">
                <Label className="text-gray-700 pb-1">Postal Code *</Label>
                <Input placeholder="Postal Code" className="bg-white border-gray-300 text-black" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                {errors.postalCode && <span className="text-red-500 text-xs">{errors.postalCode}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="shadow-lg bg-white border border-gray-200">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 border-l-4 border-blue-600 pl-3">
              Your order
            </h2>
            <div className="bg-white border rounded-xl p-6">
              <div className="flex justify-between font-semibold mb-4 text-gray-700">
                <span>Image</span>
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              {isCustomOrder ? (
                customProducts.map((item) => (
                  <div key={item._id} className="flex items-center justify-evenly mb-3 text-gray-700">
                    <img src={item?.images} alt={item?.name} className="w-16 h-16 object-cover rounded border border-gray-200" />
                   <div>
                    
                   <span className="flex-1 ml-4">{item.name} × 1</span>
                   <span className="font-semibold">₹{item.price }</span>
                    </div> 
                 

                  </div>
                ))
              ) : (
                recentproduct.map((item) => (
                  <div key={item.id} className="flex items-center justify-between mb-3 text-gray-700">
                    <img src={item?.images} alt={item?.name} className="w-16 h-16 object-cover rounded border border-gray-200" />
                    <span className="flex-1 ml-4">{item.name} × {item.quantity}</span>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))
              )}
              <hr className="my-3" />
              <div className="flex justify-between text-blue-700">
                <span>Subtotal</span>
                <span>₹{isCustomOrder ? customTotal : total}</span>
              </div>
              {
                isCustomOrder && <div className="flex justify-between text-blue-700">
               <p>Installation Charges</p> <p>{customConfig?.installationPrice}</p>
              </div>
                
              }
              <div className="flex justify-between font-bold text-blue-800 text-lg mt-2">
                <span>Total</span>
                <span>₹{isCustomOrder ? customTotal : total}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Choose Payment Method
              </h3>
              
              <RadioGroup 
                value={selectedPaymentMethod} 
                onValueChange={setSelectedPaymentMethod}
                className="space-y-4"
              >
                {/* Online Payment - Razorpay */}
                <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={PAYMENT_METHODS.RAZORPAY} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Online Payment</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Secure</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay with Credit/Debit Cards, UPI, Net Banking, Wallets
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Smartphone className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">Instant confirmation • Powered by Razorpay</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={PAYMENT_METHODS.COD} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Cash on Delivery</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">COD</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay when your order is delivered to your doorstep
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Banknote className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">Cash payment on delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
              
              {errors.paymentMethod && (
                <span className="text-red-500 text-xs mt-2 block">{errors.paymentMethod}</span>
              )}
            </div>

            {/* Conditional Payment UI */}
            {selectedPaymentMethod === PAYMENT_METHODS.RAZORPAY ? (
              <div className="mt-6">
                <RazorpayPayment
                  orderData={{
                    user: user?._id || user?.id,
                    orderId: generateOrderId('ORDEROXID'),
                    items: isCustomOrder
                      ? customProducts.map((item) => ({
                          product: item._id,
                          quantity: 1,
                          price: item.price,
                        }))
                      : recentproduct.map((item) => ({
                          product: item._id,
                          quantity: item.quantity,
                          price: item.price,
                        })),
                    totalAmount: isCustomOrder ? customTotal : total,
                    shippingAddress: { address, city, postalCode, country },
                    paymentMethod: PAYMENT_METHODS.RAZORPAY,
                    isCustomOrder: isCustomOrder,
                    notes: isCustomOrder ? 'Custom RO system order' : ''
                  }}
                  userInfo={{
                    id: user?._id || user?.id,
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || ''
                  }}
                  onPaymentSuccess={(paymentData) => {
                    toast.success('Payment successful! Your order has been confirmed.');
                    setOrderPlaced(true);
                    setPlacedOrderData(paymentData);
                    // Clear localStorage for custom orders
                    if (isCustomOrder) {
                      localStorage.removeItem('custom-ro-config');
                    }
                    // Redirect to order confirmation
                    setTimeout(() => {
                      router.push(`/dashboard`);
                    }, 2000);
                  }}
                  onPaymentError={(error) => {
                    console.error('Payment error:', error);
                    toast.error('Payment failed. Please try again.');
                  }}
                  disabled={!isFormValid}
                  className="w-full"
                />
              </div>
            ) : (
              <Button 
                onClick={checkouthandler}
                disabled={isPlacingOrder || !isFormValid}
                className="w-full mt-6 text-white bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold rounded-xl shadow"
              >
                {isPlacingOrder ? "Placing order..." : `Place Order - ${formatAmount(isCustomOrder ? customTotal : total)}`}
              </Button>
            )}
            
            {/* Order Success Message */}
            {orderPlaced && placedOrderData && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-green-600 mr-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-green-800 font-semibold">Order Placed Successfully!</h4>
                    <p className="text-green-700 text-sm">Order ID: {placedOrderData.orderId}</p>
                    <p className="text-green-600 text-xs mt-1">Redirecting to order history...</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}

CheckoutPage.requiredRole = 'customer';
