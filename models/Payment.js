import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash_on_delivery']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'disputed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    trim: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'paypal', 'manual', 'other'],
    default: 'manual'
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  failureReason: {
    type: String,
    trim: true
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundedAt: {
    type: Date
  },
  disputeReason: {
    type: String,
    trim: true
  },
  disputeResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

