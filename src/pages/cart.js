"use client";

import React, { useState ,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCartIcon,
  TrashIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
 
} from "../redux/slices/cartSlice";
import { IndianRupee ,ShoppingCart} from "lucide-react";
import SEO from "@/src/components/SEO";
 

const MyShoppingCart = () => {
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const allProducts = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    if ((!cartItems || cartItems.length === 0) && typeof window !== 'undefined') {
      const stored = localStorage.getItem('cartItems');
      if (stored) {
        try {
          setLocalCart(JSON.parse(stored));
        } catch {
          setLocalCart([]);
        }
      }
    }
  }, [cartItems]);

  const displayCartItems = (cartItems && cartItems.length > 0) ? cartItems : localCart;

  const router = useRouter();
  const skuid = router.query?.skuid;

  // If skuid is present, show only that product
  let singleProduct = null;
  if (skuid) {
    singleProduct = allProducts.find((p) => p.skuid === skuid);
  }
  const displayItems = skuid && singleProduct ? [singleProduct] : displayCartItems;

  const theme = {
    bg: "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50",
    card: "bg-white text-black",
    text: "text-black",
    accent: "text-blue-600",
  };

  const subtotal = displayItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const savings = displayItems.reduce(
    (acc, item) => acc + ((item.originalPrice || item.price) - item.price) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 100 ? 0 : 0.00;
  const tax = subtotal * 0.08;
 
  const total = subtotal + shipping + tax;

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cartItems');
      if (stored) {
        try {
          const arr = JSON.parse(stored).filter((item) => item._id !== id);
          localStorage.setItem('cartItems', JSON.stringify(arr));
          setLocalCart(arr);
        } catch {}
      }
    }
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed to checkout");
      router.push("/authpage");
      return;
    }
    if (user.role !== "customer" && user.role !== "admin") {
      toast.error("Only registered customers can checkout");
      return;
    }
    router.push(skuid ? `/customer/billingorder?skuid=${skuid}` : "/customer/billingorder");
  };

  return (
    <>
      <SEO
        title="Shopping Cart"
        description="View your selected water purifiers, replacement filters, and accessories."
        canonical="/cart"
        noindex={true}
      />
      <div className={`min-h-screen ${theme.bg} pt-24 px-4`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center p-6 rounded-xl bg-white shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <ShoppingCartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Shopping Cart</h2>
              <p className="text-gray-600">{displayItems.length} items in your cart</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-xl shadow p-6 ${theme.card}`}>
              <h3 className="text-xl font-semibold mb-6">Your Items</h3>

              {displayItems.length === 0 ? (
                 <div className="text-center ">
                                <div className="text-6xl mb-4 text-gray-400"><ShoppingCart className="w-24 h-24 mx-auto" /></div>
                                <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h4>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Start shopping to add items to your cart</p>
                                <button
                                 onClick={() => router.push("/shop")}
                                 className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors">
                                  Browse Products
                                </button>
                              </div>
              ) : (
                displayItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4  rounded-lg  mb-5 bg-gray-100"
                  >
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <h4 className="text-lg font-bold">{item.name}</h4>
                      <p className="text-sm text-gray-500">Category: {item?.category?.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold flex text-blue-600">
                          <IndianRupee className="w-5 h-5 mt-1" /><p className="text-xl"> {item?.price?.toFixed(2)}</p>
                        </span>
                        
                      </div>
                    </div>
                    {/* Only show quantity controls and remove if not skuid mode */}
                    {!skuid && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dispatch(decreaseQty(item._id))}
                          className="bg-blue-100 p-1 cursor-pointer rounded disabled:opacity-50"
                          disabled={item.quantity === 1}
                        >
                          <MinusIcon className="h-4 w-4 text-blue-600" />
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(increaseQty(item._id))}
                          className="bg-blue-100 cursor-pointer p-1 rounded"
                        >
                          <PlusIcon className="h-4 w-4 text-blue-600" />
                        </button>
                      </div>
                    )}
                    {!skuid && (
                      <button onClick={() => handleRemove(item._id)}>
                        <TrashIcon className="h-5 w-5 cursor-pointer text-red-500" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`rounded-xl shadow p-6 ${theme.card}`}>
            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                 <span className="flex"> <IndianRupee className="w-5 h-5 mt-1" /> <p className="text-2xl">{subtotal.toFixed(2)}</p> </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>You saved</span>
                  <span className="flex"> <IndianRupee className="w-5 h-5 mt-1" /> <p className="text-2xl">{savings.toFixed(2)}</p></span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="flex"> <IndianRupee className="w-5 h-5 mt-1" /><p className="text-2xl">{shipping === 0 ? "0.00" : `${shipping.toFixed(2)}`}</p>   </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="flex"> <IndianRupee className="w-5 h-5 mt-1" /><p className="text-2xl">{tax.toFixed(2)}</p> </span>
              </div>
              
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600 flex"> <IndianRupee className="w-5 mt-1" /> <p className="text-2xl">{total.toFixed(2)}</p> </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded flex justify-center items-center gap-2"
              >
                <CreditCardIcon className="h-5 w-5" />
                Proceed to Checkout
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                Secure 256-bit SSL encryption
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
          <div className="p-6 rounded-xl max-w-md w-full bg-white">
            <h2 className="text-xl font-bold mb-3">Confirm Checkout</h2>
            <p className="text-sm text-gray-600 mb-6">
              You’ll be redirected to the secure payment page.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-2 rounded border border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  handleCheckout();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

MyShoppingCart.requireAuth = true;

export default MyShoppingCart;
