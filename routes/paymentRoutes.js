import express from 'express';
import { Payment, Order } from '../models/index.js';

const router = express.Router();

// @route   GET /api/payments
// @desc    Get all payments
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { status, paymentMethod, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const payments = await Payment.find(query)
      .populate('order', 'orderNumber totalPrice')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payments/failed
// @desc    Get failed payments
// @access  Private/Admin
router.get('/failed', async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'failed' })
      .populate('order')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payments/disputes
// @desc    Get disputed payments
// @access  Private/Admin
router.get('/disputes', async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'disputed', disputeResolved: false })
      .populate('order')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund
// @access  Private/Admin
router.post('/refund', async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const refundAmount = amount || payment.amount;

    payment.refundAmount = refundAmount;
    payment.status = 'refunded';
    payment.refundedAt = new Date();
    await payment.save();

    // Update order if exists
    if (payment.order) {
      const order = await Order.findById(payment.order);
      if (order) {
        order.refundAmount = refundAmount;
        order.refundReason = reason;
        order.refundedAt = new Date();
        order.orderStatus = 'refunded';
        await order.save();
      }
    }

    res.json({
      message: 'Refund processed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payments/export
// @desc    Export financial report
// @access  Private/Admin
router.get('/export', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: 'completed' };

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const payments = await Payment.find(query)
      .populate('order')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Format for export
    const exportData = payments.map(payment => ({
      date: payment.createdAt,
      transactionId: payment.transactionId,
      customer: payment.user?.name || 'N/A',
      email: payment.user?.email || 'N/A',
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      orderNumber: payment.order?.orderNumber || 'N/A'
    }));

    res.json({
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
      totalTransactions: payments.length,
      data: exportData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

