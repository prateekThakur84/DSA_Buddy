const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayCustomerId: {
      type: String,
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
    planType: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    status: {
      type: String,
      enum: [
        'created',
        'authenticated',
        'active',
        'paused',
        'cancelled',
        'expired',
        'halted',
      ],
      default: 'created',
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    startDate: Date,
    endDate: Date,
    nextBillingDate: Date,
    currentStart: Date,
    currentEnd: Date,
    cancelledAt: Date,
    paidCount: {
      type: Number,
      default: 0,
    },
    remainingCount: Number,
    totalCount: Number,
    shortUrl: String,
    notes: Schema.Types.Mixed,
    razorpayData: Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Compound indexes for efficient queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function () {
  return (
    this.status === 'active' &&
    this.endDate &&
    this.endDate > new Date()
  );
};

const Subscription = mongoose.model('subscription', subscriptionSchema);
module.exports = Subscription;
