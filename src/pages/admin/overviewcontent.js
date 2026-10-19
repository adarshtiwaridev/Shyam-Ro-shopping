import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShoppingCart, DollarSign, IndianRupee, Users, CheckCircle, Eye, Pencil, Trash2, User, CreditCard, Truck, Clock, Bolt } from "lucide-react";
import { startOfWeek, startOfMonth, startOfYear, format, getISOWeek, getYear, getMonth, getDate } from 'date-fns';

export default function OverviewContent() {
  OverviewContent.requiredRole = 'admin';
  // Fetch recent orders from Redux
  const reduxOrders = useSelector(state => state.order.orders);
  const orders = [...reduxOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const [viewOrder, setViewOrder] = useState(null);
  // Recent activity
 

  // Sample data for the bar chart
  const weeklyStats = [
    { label: 'Week 1', orders: 320, revenue: 22000 },
    { label: 'Week 2', orders: 410, revenue: 26000 },
    { label: 'Week 3', orders: 280, revenue: 18000 },
    { label: 'Week 4', orders: 237, revenue: 14500 },
  ];
  const monthlyStats = [
    { label: 'Jan', orders: 1200, revenue: 90000 },
    { label: 'Feb', orders: 1100, revenue: 85000 },
    { label: 'Mar', orders: 1300, revenue: 95000 },
    { label: 'Apr', orders: 1250, revenue: 91000 },
    { label: 'May', orders: 1400, revenue: 100000 },
    { label: 'Jun', orders: 1350, revenue: 98000 },
    { label: 'Jul', orders: 1200, revenue: 92000 },
    { label: 'Aug', orders: 1500, revenue: 110000 },
    { label: 'Sep', orders: 1450, revenue: 108000 },
    { label: 'Oct', orders: 1380, revenue: 99000 },
    { label: 'Nov', orders: 1420, revenue: 102000 },
    { label: 'Dec', orders: 1550, revenue: 115000 },
  ];
  const yearlyStats = [
    { label: '2021', orders: 14500, revenue: 1050000 },
    { label: '2022', orders: 15800, revenue: 1120000 },
    { label: '2023', orders: 16200, revenue: 1200000 },
    { label: '2024', orders: 17000, revenue: 1300000 },
  ];

  const [barView, setBarView] = useState('week');
  const [barData, setBarData] = useState([]);
  useEffect(() => {
    // Compute barData from orders
    let data = [];
    if (barView === 'week') {
      // Group by week of current month
      const now = new Date();
      const year = getYear(now);
      const month = getMonth(now);

      // Find the first and last day of the month
      const firstDay = startOfMonth(now);
      const lastDay = new Date(year, month + 1, 0);

      // Build week ranges for the month
      let weekRanges = [];
      let start = new Date(firstDay);
      while (start <= lastDay) {
        let end = new Date(start);
        end.setDate(start.getDate() + 6);
        if (end > lastDay) end = new Date(lastDay);
        weekRanges.push({ start: new Date(start), end: new Date(end) });
        start.setDate(start.getDate() + 7);
      }

      // Initialize data for each week
      data = weekRanges.map((range, i) => ({
        label: `Week ${i + 1}`,
        orders: 0,
        revenue: 0,
      }));

      // Assign orders to the correct week
      orders.forEach(order => {
        const d = new Date(order.createdAt);
        if (getYear(d) === year && getMonth(d) === month) {
          for (let i = 0; i < weekRanges.length; i++) {
            if (d >= weekRanges[i].start && d <= weekRanges[i].end) {
              data[i].orders += 1;
              if (order.status === 'delivered') data[i].revenue += order.totalAmount || 0;
              break;
            }
          }
        }
      });

      // Always show 5 weeks for consistency
      while (data.length < 5) {
        data.push({ label: `Week ${data.length + 1}`, orders: 0, revenue: 0 });
      }
    } else if (barView === 'month') {
      // Group by month of current year
      const year = new Date().getFullYear();
      const months = {};
      orders.forEach(order => {
        const d = new Date(order.createdAt);
        if (getYear(d) === year) {
          const month = format(d, 'MMM');
          if (!months[month]) months[month] = { label: month, orders: 0, revenue: 0 };
          months[month].orders += 1;
          if (order.status === 'delivered') months[month].revenue += order.totalAmount || 0;
        }
      });
      // Ensure months are in calendar order
      const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      data = monthOrder.map(m => months[m] || { label: m, orders: 0, revenue: 0 });
    } else if (barView === 'year') {
      // Group by year
      const years = {};
      orders.forEach(order => {
        const d = new Date(order.createdAt);
        const year = getYear(d);
        if (!years[year]) years[year] = { label: String(year), orders: 0, revenue: 0 };
        years[year].orders += 1;
        if (order.status === 'delivered') years[year].revenue += order.totalAmount || 0;
      });
      data = Object.values(years).sort((a, b) => a.label.localeCompare(b.label));
    }
    setBarData(data);
  }, [barView, orders]);

  // Real dashboard stats
  const totalOrders = orders.length;
  const deliveredRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const uniqueUserIds = new Set(orders.map(o => o.user?._id).filter(Boolean));
  const totalUsers = uniqueUserIds.size;

  // Helpers
  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  const getStatusIcon = (status) => {
    const icons = {
      delivered: <CheckCircle className="w-4 h-4 text-green-600" />, // delivered
      shipped: <Truck className="w-4 h-4 text-blue-600" />, // shipped
      pending: <Clock className="w-4 h-4 text-yellow-600" />, // pending
      processing: <Bolt className="w-4 h-4 text-purple-600" /> // processing
    };
    return icons[status] || <Clock className="w-4 h-4 text-gray-600" />;
  };

  // Stat card
  const StatCard = ({ title, value, icon, growth, color }) => (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
          {growth && (
            <p className="text-xs text-green-600 mt-1">
              +{growth}% from last month
            </p>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  // Order row for new order structure
  const OrderRow = ({ order }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-medium text-gray-900 dark:text-gray-100">{order._id}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
        {order.user?.firstName} {order.user?.lastName}
        <div className="text-xs text-gray-500">{order.user?.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
        <ul className="space-y-1">
          {order.items?.map((item, idx) => (
            <li key={item._id || idx} className="flex items-center gap-2">
              {item.product?.images?.[0] && (
                <img src={item.product.images[0]} alt={item.product.name} className="w-8 h-8 object-cover rounded border" />
              )}
              <span className="font-semibold">{item.product?.name}</span>
              <span className="text-xs text-gray-500">x{item.quantity}</span>
              <span className="text-xs text-gray-500">₹{item.price}</span>
            </li>
          ))}
        </ul>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-semibold text-gray-900 dark:text-gray-100">₹{order.totalAmount}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>{getStatusIcon(order.status)} <span className="ml-1">{order.status?.toUpperCase()}</span></span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex space-x-2">
          <button className="text-blue-600 cursor-pointer hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" onClick={() => setViewOrder(order)}>View</button>
        </div>
      </td>
    </tr>
  );
 

  return (
    <div className="space-y-8">
      {/* Bar Graph for Orders & Revenue per Week/Month/Year */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Orders & Revenue</h3>
          <select
            value={barView}
            onChange={e => setBarView(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="week">Week Wise</option>
            <option value="month">Month Wise</option>
            <option value="year">Year Wise</option>
          </select>
        </div>
        <div className="w-full h-72 flex items-center justify-center">
          {barData.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-300">No data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" stroke="#6b7280" className="text-xs" />
                <YAxis yAxisId="left" orientation="left" stroke="#6b7280" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" className="text-xs" tickFormatter={v => `₹${v/1000}k`} />
                <Legend />
                <Tooltip formatter={(value, name) => name === 'revenue' ? `₹${value}` : value} />
                <Bar yAxisId="left" dataKey="orders" fill="#6366f1" name="Orders" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#f59e42" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={totalOrders} icon={<ShoppingCart className="w-8 h-8 text-green-600" />} color="text-green-600" />
        <StatCard title="Total Revenue" value={deliveredRevenue} icon={<IndianRupee className="w-8 h-8 text-blue-600" />} color="text-blue-600" />
        <StatCard title="Active Users" value={totalUsers} icon={<Users className="w-8 h-8 text-purple-600" />} color="text-purple-600" />
        <StatCard title="Delivered Orders" value={deliveredOrders} icon={<CheckCircle className="w-8 h-8 text-green-600" />} color="text-green-600" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-5">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.slice(0, 5).map(order => (
                    <OrderRow key={order._id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

       
      </div>
      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute top-3 right-3 text-gray-800 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Order Details</h2>
            <div className="space-y-2 text-gray-800">
              <div><span className="font-semibold">Order ID:</span> {viewOrder._id}</div>
              <div><span className="font-semibold">Customer:</span> {viewOrder.user?.firstName} {viewOrder.user?.lastName} ({viewOrder.user?.email})</div>
              <div><span className="font-semibold">Status:</span> {viewOrder.status}</div>
              <div><span className="font-semibold">Total:</span> ₹{viewOrder.totalAmount}</div>
              <div><span className="font-semibold">Payment Method:</span> {viewOrder.paymentMethod}</div>
              <div><span className="font-semibold">Date:</span> {viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleString() : ''}</div>
              <div><span className="font-semibold">Shipping Address:</span> {viewOrder.shippingAddress?.address}, {viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.country} - {viewOrder.shippingAddress?.postalCode}</div>
              <div className="mt-4">
                <span className="font-semibold">Products:</span>
                <ul className="mt-2 space-y-2">
                  {viewOrder.items?.map((item, idx) => (
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
          </div>
        </div>
      )}
    </div>
  );
}