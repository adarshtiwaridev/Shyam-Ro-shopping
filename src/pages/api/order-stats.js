import dbConnect from '@/src/lib/dbConnect';
import Order from '@/src/models/Order';

function getWeekOfMonth(date) {
  const d = new Date(date);
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  return Math.ceil((d.getDate() + firstDay.getDay()) / 7);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();
  try {
    const orders = await Order.find({});
    if (!orders.length) return res.status(200).json({ week: [], month: [], year: [] });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Week-wise (current month)
    const weekStats = [1, 2, 3, 4, 5].map((week) => ({
      label: `Week ${week}`,
      orders: 0,
      revenue: 0,
    }));

    orders.forEach((order) => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date(order.date || Date.now());
      const amount = Number(order.totalAmount || order.amount) || 0;

      if (!isNaN(orderDate.getTime()) && orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        const week = Math.min(getWeekOfMonth(orderDate) - 1, 4);
        if (weekStats[week]) {
          weekStats[week].orders += 1;
          weekStats[week].revenue += amount;
        }
      }
    });

    // Month-wise (current year)
    const monthStats = Array.from({ length: 12 }, (_, i) => ({
      label: new Date(0, i).toLocaleString('default', { month: 'short' }),
      orders: 0,
      revenue: 0,
    }));

    orders.forEach((order) => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date(order.date || Date.now());
      const amount = Number(order.totalAmount || order.amount) || 0;

      if (!isNaN(orderDate.getTime()) && orderDate.getFullYear() === currentYear) {
        const m = orderDate.getMonth();
        if (monthStats[m]) {
          monthStats[m].orders += 1;
          monthStats[m].revenue += amount;
        }
      }
    });

    // Year-wise (last 4 years)
    const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];
    const yearStats = years.map((y) => ({ label: y.toString(), orders: 0, revenue: 0 }));

    orders.forEach((order) => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : new Date(order.date || Date.now());
      const amount = Number(order.totalAmount || order.amount) || 0;

      if (!isNaN(orderDate.getTime())) {
        const idx = years.indexOf(orderDate.getFullYear());
        if (idx !== -1) {
          yearStats[idx].orders += 1;
          yearStats[idx].revenue += amount;
        }
      }
    });

    return res.status(200).json({
      week: weekStats,
      month: monthStats,
      year: yearStats,
    });
  } catch (err) {
    console.error('Failed to fetch order stats:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}