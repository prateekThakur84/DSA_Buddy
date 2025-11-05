const crypto = require('crypto');
const User = require('../models/user.model');
const Subscription = require('../models/subscription.model');

// ✅ Verify webhook signature
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
    match: generatedSignature === signature
  });
  
  return generatedSignature === signature;
};

// ✅ MAIN WEBHOOK HANDLER (FIXED)
const handleSubscriptionWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    console.log('🔔 Webhook received');
    
    if (!signature) {
      console.error('❌ No signature in webhook request');
      return res.status(400).json({ success: false, message: 'Missing signature' });
    }

    // ✅ Get body for verification
    let bodyToVerify = req.body;
    if (Buffer.isBuffer(req.body)) {
      bodyToVerify = req.body.toString('utf8');
    }

    // ✅ Verify signature
    if (!verifyWebhookSignature(bodyToVerify, signature)) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // ✅ Parse body
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    console.log('✅ Webhook verified');
    
    // ✅ FIXED: Extract event correctly
    const event = body.event;
    console.log('Event type:', event);
    
    // ✅ FIXED: Extract entity from correct location
    let subscriptionData = null;
    let paymentData = null;

    // Try different payload structures
    if (body.payload?.subscription?.entity) {
      subscriptionData = body.payload.subscription.entity;
      console.log('✅ Found subscription in payload.subscription.entity');
    } else if (body.payload?.entity?.type === 'subscription') {
      subscriptionData = body.payload.entity;
      console.log('✅ Found subscription in payload.entity');
    }

    if (body.payload?.payment?.entity) {
      paymentData = body.payload.payment.entity;
    }

    console.log('Subscription ID:', subscriptionData?.id);
    console.log('Event:', event);

    // ✅ Handle different event types
    switch (event) {
      case 'subscription.activated':
        console.log('📍 Processing: subscription.activated');
        if (subscriptionData) {
          await handleSubscriptionActivated(subscriptionData);
        }
        break;

      case 'subscription.charged':
        console.log('📍 Processing: subscription.charged');
        if (subscriptionData) {
          await handleSubscriptionCharged(subscriptionData, paymentData);
        }
        break;

      case 'subscription.cancelled':
        console.log('📍 Processing: subscription.cancelled');
        if (subscriptionData) {
          await handleSubscriptionCancelled(subscriptionData);
        }
        break;

      case 'subscription.paused':
        console.log('📍 Processing: subscription.paused');
        if (subscriptionData) {
          await handleSubscriptionPaused(subscriptionData);
        }
        break;

      case 'subscription.resumed':
        console.log('📍 Processing: subscription.resumed');
        if (subscriptionData) {
          await handleSubscriptionResumed(subscriptionData);
        }
        break;

      case 'subscription.pending':
        console.log('📍 Processing: subscription.pending');
        if (subscriptionData) {
          await handleSubscriptionPending(subscriptionData);
        }
        break;

      case 'subscription.halted':
        console.log('📍 Processing: subscription.halted');
        if (subscriptionData) {
          await handleSubscriptionHalted(subscriptionData);
        }
        break;

      case 'subscription.completed':
        console.log('📍 Processing: subscription.completed');
        if (subscriptionData) {
          await handleSubscriptionCompleted(subscriptionData);
        }
        break;

      case 'payment.failed':
        console.log('⚠️ Payment failed');
        break;

      default:
        console.log(`⚠️ Unhandled webhook event: ${event}`);
    }

    // ✅ Always return 200 to acknowledge receipt
    res.status(200).json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    // Return 200 even on error to prevent Razorpay retries
    res.status(200).json({ success: false, message: 'Webhook processing failed' });
  }
};

// ✅ SUBSCRIPTION ACTIVATED
const handleSubscriptionActivated = async (data) => {
  try {
    console.log('🔵 ===== SUBSCRIPTION ACTIVATED =====');
    console.log('Subscription ID:', data.id);

    const subscription = await Subscription.findOne({ 
      razorpaySubscriptionId: data.id 
    });

    if (!subscription) {
      console.error(`❌ Subscription not found: ${data.id}`);
      return;
    }

    console.log('✅ Subscription found in DB');

    // ✅ Update subscription
    subscription.status = 'active';
    subscription.startDate = new Date(data.start_at * 1000);
    subscription.endDate = new Date(data.end_at * 1000);
    subscription.currentStart = new Date(data.current_start * 1000);
    subscription.currentEnd = new Date(data.current_end * 1000);
    subscription.nextBillingDate = data.charge_at ? new Date(data.charge_at * 1000) : null;
    subscription.paidCount = data.paid_count || 1;
    
    await subscription.save();
    console.log('✅ Subscription updated in DB');

    // ✅ Update user
    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionTier = 'premium';
      user.subscriptionStartDate = subscription.startDate;
      user.subscriptionEndDate = subscription.endDate;
      user.razorpaySubscriptionId = data.id;
      
      await user.save();
      console.log(`✅ User ${user._id} updated to premium`);
      console.log(`✅ Premium valid until: ${subscription.endDate}`);
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionActivated:', error);
  }
};

// ✅ SUBSCRIPTION CHARGED (Renewal)
const handleSubscriptionCharged = async (subscriptionData, paymentData) => {
  try {
    console.log('🔵 ===== SUBSCRIPTION CHARGED (RENEWAL) =====');
    console.log('Subscription ID:', subscriptionData.id);

    const subscription = await Subscription.findOne({ 
      razorpaySubscriptionId: subscriptionData.id 
    });

    if (!subscription) {
      console.error(`❌ Subscription not found: ${subscriptionData.id}`);
      return;
    }

    // ✅ Update subscription with new cycle info
    subscription.paidCount = subscriptionData.paid_count;
    subscription.currentEnd = new Date(subscriptionData.current_end * 1000);
    subscription.nextBillingDate = subscriptionData.charge_at ? 
      new Date(subscriptionData.charge_at * 1000) : null;
    
    await subscription.save();
    console.log('✅ Subscription renewed in DB');

    // ✅ Update user with new end date
    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionEndDate = new Date(subscriptionData.current_end * 1000);
      
      if (paymentData) {
        user.paymentHistory.push({
          paymentId: paymentData.id,
          subscriptionId: subscriptionData.id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'success',
          planType: subscription.planType,
          createdAt: new Date()
        });
      }
      
      await user.save();
      console.log(`✅ User ${user._id} subscription renewed until ${user.subscriptionEndDate}`);
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionCharged:', error);
  }
};

// ✅ SUBSCRIPTION CANCELLED
const handleSubscriptionCancelled = async (data) => {
  try {
    console.log('🔵 ===== SUBSCRIPTION CANCELLED =====');

    const subscription = await Subscription.findOne({ 
      razorpaySubscriptionId: data.id 
    });

    if (!subscription) {
      console.error(`❌ Subscription not found: ${data.id}`);
      return;
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      console.log(`✅ Subscription cancelled for user ${user._id}`);
      console.log(`✅ User will remain premium until: ${user.subscriptionEndDate}`);
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionCancelled:', error);
  }
};

// ✅ SUBSCRIPTION PAUSED
const handleSubscriptionPaused = async (data) => {
  try {
    console.log('🔵 ===== SUBSCRIPTION PAUSED =====');

    const subscription = await Subscription.findOne({ 
      razorpaySubscriptionId: data.id 
    });

    if (!subscription) return;

    subscription.status = 'paused';
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionTier = 'free';
      await user.save();
      console.log(`✅ User ${user._id} paused - downgraded to free`);
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionPaused:', error);
  }
};

// ✅ SUBSCRIPTION RESUMED
const handleSubscriptionResumed = async (data) => {
  try {
    console.log('🔵 ===== SUBSCRIPTION RESUMED =====');

    const subscription = await Subscription.findOne({ 
      razorpaySubscriptionId: data.id 
    });

    if (!subscription) return;

    subscription.status = 'active';
    subscription.endDate = new Date(data.end_at * 1000);
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionTier = 'premium';
      user.subscriptionEndDate = subscription.endDate;
      await user.save();
      console.log(`✅ User ${user._id} resumed - upgraded to premium`);
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionResumed:', error);
  }
};

// ✅ SUBSCRIPTION PENDING
const handleSubscriptionPending = async (data) => {
  try {
    console.log('🔵 ===== SUBSCRIPTION PENDING =====');

    await Subscription.findOneAndUpdate(
      { razorpaySubscriptionId: data.id },
      { status: 'pending' }
    );

    console.log(`✅ Subscription ${data.id} marked as pending`);

  } catch (error) {
    console.error('❌ Error in handleSubscriptionPending:', error);
  }
};

// ✅ SUBSCRIPTION HALTED
const handleSubscriptionHalted = async (data) => {
  try {
    console.log('🔵 ===== SUBSCRIPTION HALTED =====');

    const subscription = await Subscription.findOne({ 
      razorpaySubscriptionId: data.id 
    });

    if (!subscription) return;

    subscription.status = 'halted';
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user) {
      user.subscriptionTier = 'free';
      await user.save();
      console.log(`✅ User ${user._id} halted - downgraded to free`);
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionHalted:', error);
  }
};

// ✅ SUBSCRIPTION COMPLETED
const handleSubscriptionCompleted = async (data) => {
  try {
    console.log('🔵 ===== SUBSCRIPTION COMPLETED =====');

    const subscription = await Subscription.findOne({ 
      razorpaySubscriptionId: data.id 
    });

    if (!subscription) return;

    subscription.status = 'completed';
    await subscription.save();

    const user = await User.findById(subscription.userId);
    if (user && user.subscriptionEndDate < new Date()) {
      user.subscriptionTier = 'free';
      await user.save();
      console.log(`✅ Subscription completed - user ${user._id} downgraded to free`);
    }

  } catch (error) {
    console.error('❌ Error in handleSubscriptionCompleted:', error);
  }
};

module.exports = {
  handleSubscriptionWebhook
};
