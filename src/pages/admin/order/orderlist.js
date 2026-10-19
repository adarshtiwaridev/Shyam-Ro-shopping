"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { setOrders } from "@/src/redux/slices/orderSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
export default function OrderManagement() {
  // Get all orders from redux
  const { orders: reduxOrders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  // Map redux orders to table format
  const allOrders = useMemo(() => {
    return reduxOrders.map(order => {
      const customer = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : '';
      const productNames = order.items && order.items.length > 0 ? order.items.map(item => item.product?.name || '').join(', ') : '';
      const quantity = order.items && order.items.length > 0 ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
      return {
        id: order.orderId || order._id,
        customer,
        product: productNames,
        quantity,
        amount: order.totalAmount,
        status: order.status,
        date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
        address: order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}` : '',
        trackingAddress: order.trackingAddress || '',
        trackingHistory: order.trackingHistory || [],
        raw: order,
      };
    });
  }, [reduxOrders]);
  
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
   
  const [editTrackingAddress, setEditTrackingAddress] = useState(null);
  const [newTrackingAddress, setNewTrackingAddress] = useState('');

  const [statusEdit, setStatusEdit] = useState({}); // { [orderId]: status }
  const [statusLoading, setStatusLoading] = useState({}); // { [orderId]: boolean }

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = () => {
    if (!editOrder) return;
    dispatch(setOrders(reduxOrders.map((o) => (o._id === editOrder.raw?._id || o.orderId === editOrder.id) ? { ...o, ...editForm } : o)));
    setEditOrder(null);
    setEditForm({});
    toast.success("Order updated in view");
  };

  const handleDelete = () => {
    if (!deleteOrder) return;
    const orderId = deleteOrder.raw?._id || deleteOrder.id;
    dispatch(setOrders(reduxOrders.filter((o) => o._id !== orderId && o.orderId !== orderId)));
    setDeleteOrder(null);
    toast.success("Order removed from list");
  };

  const handleUpdateTrackingAddress = async () => {
    if (!editTrackingAddress || !newTrackingAddress.trim()) return;
    const dbId = editTrackingAddress.raw?._id || editTrackingAddress.id;
    try {
      const res = await fetch('/api/admin/updateorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: dbId, trackingAddress: newTrackingAddress.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        dispatch(setOrders(reduxOrders.map(o => (o._id === dbId || o.orderId === editTrackingAddress.id) ? { ...o, trackingAddress: newTrackingAddress.trim() } : o)));
        toast.success("Tracking address updated");
        setEditTrackingAddress(null);
        setNewTrackingAddress('');
      } else {
        toast.error(data.message || 'Failed to update tracking address');
      }
    } catch (err) {
      toast.error('Failed to update tracking address');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusEdit(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleStatusUpdate = async (orderId) => {
    const targetOrder = allOrders.find(o => o.id === orderId);
    const dbId = targetOrder?.raw?._id || orderId;
    setStatusLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch('/api/admin/updateorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: dbId, status: statusEdit[orderId] })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update Redux orders immediately
        dispatch(setOrders(reduxOrders.map(o => (o._id === dbId || o.orderId === orderId) ? { ...o, status: statusEdit[orderId] } : o)));
        setStatusEdit(prev => ({ ...prev, [orderId]: undefined }));
        toast.success("Status updated successfully");
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
    setStatusLoading(prev => ({ ...prev, [orderId]: false }));
  };

 
  
 

 

  const OrderRow = ({ order }) => (
    <>
      <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="font-medium text-gray-900 dark:text-gray-100">{order.id}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
          {order.customer}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
          {order.product}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
          {order.quantity}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{order.amount}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <select
            value={statusEdit[order.id] !== undefined ? statusEdit[order.id] : order.status}
            onChange={e => handleStatusChange(order.id, e.target.value)}
            className="border text-black rounded px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {statusEdit[order.id] && statusEdit[order.id] !== order.status && (
            <Button
              size="sm"
              className="ml-2 bg-blue-600 text-white"
              loading={statusLoading[order.id]}
              onClick={() => handleStatusUpdate(order.id)}
            >
              Update
            </Button>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
          {order.date}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
          <span className="text-sm font-medium">{order.trackingAddress}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <div className="flex space-x-2">
             
             {/* Edit Tracking Address Button */}
            <button 
              onClick={() => {
                setEditTrackingAddress(order);
                setNewTrackingAddress(order.trackingAddress);
              }}
              className="text-gray-900" 
              title="Edit Tracking Address"
            >
              <span role="img" aria-label="Edit Tracking">Edit</span>
            </button>

            
            {/* View Order Button */}
            <Dialog open={!!viewOrder && viewOrder.id === order.id} onOpenChange={(open) => setViewOrder(open ? order : null)}>
              <DialogTrigger asChild>
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="View">
                  <span role="img" aria-label="View">View</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-blue-700 dark:text-cyan-300">Order Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-gray-800 dark:text-gray-100">
                  <div><b>Order ID:</b> {order.id}</div>
                  <div><b>Customer:</b> {order.customer}</div>
                  <div><b>Product:</b> {order.product}</div>
                  <div><b>Quantity:</b> {order.quantity}</div>
                  <div><b>Amount:</b> {order.amount}</div>
                  <div><b>Status:</b> {order.status}</div>
                  <div><b>Date:</b> {order.date}</div>
                  <div><b>Address:</b> {order.address}</div>
                  <div><b>Tracking Address:</b> {order.trackingAddress}</div>
                </div>
              </DialogContent>
            </Dialog>

           

            {/* Delete Order Button */}
            {user?.role !== 'microadmin' && (
              <Dialog open={!!deleteOrder && deleteOrder.id === order.id} onOpenChange={(open) => setDeleteOrder(open ? order : null)}>
                <DialogTrigger asChild>
                  <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                    <span role="img" aria-label="Delete">Delete</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-red-600 dark:text-red-400">Delete Order</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 text-gray-800 dark:text-gray-100">Are you sure you want to delete order <b>{order.id}</b>?</div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleteOrder(null)} className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">Cancel</Button>
                    <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </td>
      </tr>
      
       
    </>
  );

  return (
    <div className="space-y-6">
      {/* Edit Tracking Address Modal */}
      <Dialog open={!!editTrackingAddress} onOpenChange={(open) => !open && setEditTrackingAddress(null)}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-purple-600 dark:text-purple-300">Edit Tracking Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Order ID</label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{editTrackingAddress?.id}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-800 font-medium mb-1">Current Tracking Address</label>
              <p className="text-sm text-gray-800 dark:text-gray-400">{editTrackingAddress?.trackingAddress}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-800 font-medium mb-1">New Tracking Address</label>
              <input 
                type="text" 
                value={newTrackingAddress} 
                onChange={(e) => setNewTrackingAddress(e.target.value)}
                className="w-full border rounded px-2 py-1 dark:bg-gray-800 text-black dark:border-gray-700"
                placeholder="Enter new tracking address"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditTrackingAddress(null)} className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                Cancel
              </Button>
              <Button onClick={handleUpdateTrackingAddress} className="bg-purple-600 text-white hover:bg-purple-700">
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

     

      {/* Main Table */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tracking Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {allOrders.map(order => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
