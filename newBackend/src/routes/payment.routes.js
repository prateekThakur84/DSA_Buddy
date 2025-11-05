const express = require('express');
const paymentRouter = express.Router();
const { authenticateUser } = require('../middleware/auth.middleware');
const {
  getPlans,
  createSubscription,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription
} = require('../controllers/subscription.controller');
const { handleSubscriptionWebhook } = require('../controllers/webhook.controller');

// Public routes - NO authentication
paymentRouter.post('/webhook', handleSubscriptionWebhook);
paymentRouter.get('/plans', getPlans);
paymentRouter.get('/payment-pages', (req, res) => {
  try {
    res.json({
      success: true,
      paymentPages: {
        monthly: process.env.RAZORPAY_PAYMENT_PAGE_MONTHLY,
        yearly: process.env.RAZORPAY_PAYMENT_PAGE_YEARLY
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protected routes - REQUIRES authentication
paymentRouter.post('/create-subscription', authenticateUser, createSubscription);
paymentRouter.post('/verify-payment', authenticateUser, verifyPayment);
paymentRouter.get('/subscription-status', authenticateUser, getSubscriptionStatus);
paymentRouter.post('/cancel-subscription', authenticateUser, cancelSubscription);

module.exports = paymentRouter;
