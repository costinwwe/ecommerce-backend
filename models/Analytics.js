import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  sales: {
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 }
  },
  users: {
    newUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 }
  },
  products: {
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 }
  },
  topProducts: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    sales: Number,
    revenue: Number
  }],
  abandonedCarts: {
    type: Number,
    default: 0
  },
  lowStockAlerts: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    currentStock: Number
  }]
}, {
  timestamps: true
});

// Index for date queries
analyticsSchema.index({ date: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;

