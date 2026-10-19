"use client";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SEO from "@/src/components/SEO";

export default function OrderHistory() {
  
  const { orders } = useSelector((state) => state.order);
  const user = useSelector((state) => state.auth.user);
  
  // Filter orders for the logged-in user
  const userOrders = useMemo(() => {
    const currentUserId = (user?.id || user?._id)?.toString();
    if (!currentUserId) return [];
    return orders.filter(order => {
      const orderUserId = (order.user?._id || order.user)?.toString();
      return orderUserId === currentUserId;
    });
  }, [orders, user]);
 
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackOrder, setTrackOrder] = useState(null);

  return (
    <>
      <SEO
        title="My Orders"
        description="View past orders and order delivery tracking."
        canonical="/customer/orderhistory"
        noindex={true}
      />
   <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {userOrders.map(order => (
                      <tr key={order._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{order.orderId || order._id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                          {order.items && order.items.length > 0 ? order.items.map(item => item.product?.name || '').join(', ') : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">₹{order.totalAmount}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 text-gray-900 rounded-full text-xs font-medium border`}>{order.status?.toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <Dialog open={selectedOrder?._id === order._id} onOpenChange={open => setSelectedOrder(open ? order : null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-blue-400 text-blue-700 bg-blue-50">View</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 rounded-xl shadow-xl">
                                <DialogHeader>
                                  <DialogTitle className="text-blue-700 dark:text-cyan-300">Order Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2 text-gray-800 dark:text-gray-100">
                                  <div><b>Order ID:</b> {order.orderId || order._id}</div>
                                  <div><b>Status:</b> {order.status}</div>
                                  <div><b>Total:</b> ₹{order.totalAmount}</div>
                                  <div><b>Date:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</div>
                                  <div><b>Shipping Address:</b> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country} - {order.shippingAddress?.postalCode}</div>
                                  <div className="mt-4">
                                    <span className="font-semibold">Products:</span>
                                    <ul className="mt-2 space-y-2">
                                      {order.items?.map((item, idx) => (
                                        <li key={item._id || idx} className="flex items-center gap-3 border-b pb-2 last:border-b-0">
                                          {item.product?.images?.[0] && (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-cover rounded border" />
                                          )}
                                          <div>
                                            <div className="font-semibold">{item.product?.name}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity} | Price: ₹{item.price}</div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog open={trackOrder?._id === order._id} onOpenChange={open => setTrackOrder(open ? order : null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-green-400 text-green-700 bg-green-50">Track Order</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-700 rounded-xl shadow-xl">
                                <DialogHeader>
                                  <DialogTitle className="text-green-700 dark:text-green-300">Track Order</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2 text-gray-800 dark:text-gray-100">
                                  <div><b>Address:</b> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country} - {order.shippingAddress?.postalCode}</div>
                                  <div><b>Status:</b> {order.status}</div>
                                  <div><b>Date:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
    </>
  );
}

OrderHistory.requiredRole = 'customer';
