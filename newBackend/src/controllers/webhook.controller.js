const crypto = require('crypto');
const User = require('../models/user.model');
const Subscription = require('../models/subscription.model');

// ============ VERIFY WEBHOOK SIGNATURE ============
const verifyWebhookSignature = (body, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('❌ RAZORPAY_WEBHOOK_SECRET not configured');
    return false;
  }
  
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  
  const generatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(bodyString)
    .digest('hex');
  
  console.log('🔐 Webhook signature verification:', {
    received: signature,
    generated: generatedSignature,
    match: generatedSignature === signature
  });
  
  return generatedSignature === signature;
};

// ============ MAIN WEBHOOK HANDLER ============
const handleSubscriptionWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    console.log('🔔 Webhook received:', {
      signature: signature ? '✓ Present' : '✗ Missing',
      contentType: req.headers['content-type'],
      bodyType: typeof req.body
    });
    
    if (!signature) {
      console.error('❌ No signature in webhook request');
      return res.status(400).json({ success: false, message: 'Missing signature' });
    }

    let bodyToVerify = req.body;
    if (Buffer.isBuffer(req.body)) {
      bodyToVerify = req.body.toString('utf8');
    }

    if (!verifyWebhookSignature(bodyToVerify, signature)) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { event, payload } = body;
    const subscriptionData = payload.subscription?.entity;
    const paymentData = payload.payment?.entity;

    console.log(`✓ Webhook verified and processed: ${event} for subscription: ${subscriptionData?.id}`);

    switch (event) {
      case 'subscription.activated':
        await handleSubscriptionActivated(subscriptionData);
        break;
      case 'subscription.charged':
        await handleSubscriptionCharged(subscriptionData, paymentData);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(subscriptionData);
        break;
      case 'subscription.paused':
        await handleSubscriptionPaused(subscriptionData);
        break;
      case 'subscription.resumed':
        await handleSubscriptionResumed(subscriptionData);
        break;
      case 'subscription.pending':
        await handleSubscriptionPending(subscriptionData);
        break;
      case 'subscription.halted':
        await handleSubscriptionHalted(subscriptionData);
        break;
      case 'subscription.completed':
        await handleSubscriptionCompleted(subscriptionData);
        break;
      case 'payment.failed':
        console.log(`⚠️ Payment failed for subscription: ${paymentData?.subscription_id}`);
        break;
      default:
        console.log(`⚠️ Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(200).json({ success: false, message: 'Webhook processing failed but acknowledged' });
  }
};

// ============ SUBSCRIPTION ACTIVATED ============
const handleSubscriptionActivated = async (data) => {
  try {
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: data.id });
    if (!subscription) {
      console.error(`❌ Subscription not found: ${data.id}`);
      return;
    }

    subscription.status = 'active';
    subscription.startDate = new Date(data.start_at * 1000);
    subscription.endDate = new Date(data.end_at * 1000);
    subscription.currentStart = new Date(data.current_start * 1000);
    subscription.currentEnd = new Date(data.current_end * 1000);
    subscription.nextBillingDate = data.charge_at ? new Date(data.charge_at * 1000) : null;
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionTier = 'premium';
      user.subscriptionStartDate = subscription.startDate;
      user.subscriptionEndDate = subscription.endDate;
      user.razorpaySubscriptionId = data.id;
      await user.save();
      console.log(`✓ User ${user._id} activated premium until ${subscription.endDate}`);
    }
  } catch (error) {
    console.error('❌ Error handling subscription.activated:', error);
  }
};

// ============ SUBSCRIPTION CHARGED ============
const handleSubscriptionCharged = async (subscriptionData, paymentData) => {
  try {
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
    if (!subscription) {
      console.error(`❌ Subscription not found: ${subscriptionData.id}`);
      return;
    }

    subscription.paidCount = subscriptionData.paid_count;
    subscription.currentEnd = new Date(subscriptionData.current_end * 1000);
    subscription.nextBillingDate = subscriptionData.charge_at ? new Date(subscriptionData.charge_at * 1000) : null;
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user && paymentData) {
      user.subscriptionEndDate = new Date(subscriptionData.current_end * 1000);
      user.paymentHistory.push({
        paymentId: paymentData.id,
        subscriptionId: subscriptionData.id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status,
        planType: subscription.planType,
        createdAt: new Date()
      });
      await user.save();
      console.log(`✓ Subscription renewed for user ${user._id} until ${user.subscriptionEndDate}`);
    }
  } catch (error) {
    console.error('❌ Error handling subscription.charged:', error);
  }
};

// ============ SUBSCRIPTION CANCELLED ============
const handleSubscriptionCancelled = async (data) => {
  try {
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: data.id });
    if (!subscription) return;

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();
    console.log(`✓ Subscription cancelled: ${data.id}`);
  } catch (error) {
    console.error('❌ Error handling subscription.cancelled:', error);
  }
};

// ============ SUBSCRIPTION PAUSED ============
const handleSubscriptionPaused = async (data) => {
  try {
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: data.id });
    if (!subscription) return;

    subscription.status = 'paused';
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionTier = 'free';
      await user.save();
      console.log(`✓ Subscription paused, user ${user._id} downgraded to free`);
    }
  } catch (error) {
    console.error('❌ Error handling subscription.paused:', error);
  }
};

// ============ SUBSCRIPTION RESUMED ============
const handleSubscriptionResumed = async (data) => {
  try {
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: data.id });
    if (!subscription) return;

    subscription.status = 'active';
    subscription.endDate = new Date(data.end_at * 1000);
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionTier = 'premium';
      user.subscriptionEndDate = subscription.endDate;
      await user.save();
      console.log(`✓ Subscription resumed, user ${user._id} upgraded to premium`);
    }
  } catch (error) {
    console.error('❌ Error handling subscription.resumed:', error);
  }
};

// ============ SUBSCRIPTION PENDING ============
const handleSubscriptionPending = async (data) => {
  try {
    await Subscription.findOneAndUpdate(
      { razorpaySubscriptionId: data.id },
      { status: 'pending' }
    );
    console.log(`✓ Subscription pending: ${data.id}`);
  } catch (error) {
    console.error('❌ Error handling subscription.pending:', error);
  }
};

// ============ SUBSCRIPTION HALTED ============
const handleSubscriptionHalted = async (data) => {
  try {
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: data.id });
    if (!subscription) return;

    subscription.status = 'halted';
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionTier = 'free';
      await user.save();
      console.log(`✓ Subscription halted, user ${user._id} downgraded to free`);
    }
  } catch (error) {
    console.error('❌ Error handling subscription.halted:', error);
  }
};

// ============ SUBSCRIPTION COMPLETED ============
const handleSubscriptionCompleted = async (data) => {
  try {
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: data.id });
    if (!subscription) return;

    subscription.status = 'completed';
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user && user.subscriptionEndDate < new Date()) {
      user.subscriptionTier = 'free';
      await user.save();
      console.log(`✓ Subscription completed, user ${user._id} downgraded to free`);
    }
  } catch (error) {
    console.error('❌ Error handling subscription.completed:', error);
  }
};

module.exports = {
  handleSubscriptionWebhook
};
