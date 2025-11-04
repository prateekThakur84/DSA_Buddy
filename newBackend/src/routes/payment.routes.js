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

// ✅ IMPORTANT: Webhook must NOT require authentication
paymentRouter.post('/webhook', handleSubscriptionWebhook);

// Public routes
paymentRouter.get('/plans', getPlans);

// Protected routes
paymentRouter.post('/create-subscription', authenticateUser, createSubscription);
paymentRouter.post('/verify-payment', authenticateUser, verifyPayment);
paymentRouter.get('/subscription-status', authenticateUser, getSubscriptionStatus);
paymentRouter.post('/cancel-subscription', authenticateUser, cancelSubscription);

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

paymentRouter.post('/log-payment-attempt', authenticateUser, async (req, res) => {
  try {
    const { planType } = req.body;
    const userId = req.user.id;
    
    console.log(`📊 User ${userId} clicked payment link for ${planType} plan`);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = paymentRouter;
