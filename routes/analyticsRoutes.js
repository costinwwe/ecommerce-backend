import express from 'express';
import { Order, User, Product, Cart, Payment, Analytics } from '../models/index.js';

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const { period = 'today' } = req.query; // today, week, month, year
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    // Sales data
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      orderStatus: { $ne: 'cancelled' }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // New users
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
      role: 'customer'
    });

    // Best selling products
    const productSales = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const productId = item.product?.toString() || 'unknown';
        if (!productSales[productId]) {
          productSales[productId] = { sales: 0, revenue: 0, name: item.name };
        }
        productSales[productId].sales += item.quantity;
        productSales[productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({ product: id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Low stock alerts
    const lowStockProducts = await Product.find({
      stock: { $lte: { $ifNull: ['$lowStockThreshold', 10] } },
      isActive: true
    }).select('name stock lowStockThreshold').limit(10);

    // Abandoned carts (carts older than 24 hours)
    const abandonedCartsDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const abandonedCarts = await Cart.countDocuments({
      updatedAt: { $lt: abandonedCartsDate },
      items: { $exists: true, $ne: [] }
    });

    // Sales over time (for chart)
    const salesOverTime = [];
    const days = period === 'today' ? 24 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const interval = period === 'today' ? 'hour' : 'day';

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      if (interval === 'hour') {
        date.setHours(date.getHours() - i, 0, 0, 0);
      } else {
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
      }

      const nextDate = new Date(date);
      if (interval === 'hour') {
        nextDate.setHours(nextDate.getHours() + 1);
      } else {
        nextDate.setDate(nextDate.getDate() + 1);
      }

      const dayOrders = await Order.find({
        createdAt: { $gte: date, $lt: nextDate },
        orderStatus: { $ne: 'cancelled' }
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      salesOverTime.push({
        date: date.toISOString(),
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }

    res.json({
      period,
      sales: {
        totalRevenue,
        totalOrders,
        averageOrderValue
      },
      users: {
        newUsers
      },
      topProducts,
      lowStockAlerts: lowStockProducts,
      abandonedCarts,
      salesOverTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/revenue
// @desc    Get revenue breakdown
// @access  Private/Admin
router.get('/revenue', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { orderStatus: { $ne: 'cancelled' } };

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const orders = await Order.find(query);
    const payments = await Payment.find({ status: 'completed' });

    const revenueByMethod = {};
    const revenueByStatus = {};

    orders.forEach(order => {
      revenueByStatus[order.orderStatus] = (revenueByStatus[order.orderStatus] || 0) + order.totalPrice;
    });

    payments.forEach(payment => {
      revenueByMethod[payment.paymentMethod] = (revenueByMethod[payment.paymentMethod] || 0) + payment.amount;
    });

    res.json({
      totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      revenueByMethod,
      revenueByStatus,
      totalTransactions: payments.length,
      failedPayments: await Payment.countDocuments({ status: 'failed' })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

