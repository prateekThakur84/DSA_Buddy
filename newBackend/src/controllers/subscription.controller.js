const { razorpayInstance, SUBSCRIPTION_PLANS } = require('../config/razorpay.config');
const crypto = require('crypto');
const User = require('../models/user.model');
const Subscription = require('../models/subscription.model');

const getPlans = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      plans: [
        {
          type: 'monthly',
          name: 'Premium Monthly',
          amount: 199,
          currency: 'INR',
          period: 'month',
          description: 'Perfect for trying out premium features',
          features: [
            'Unlimited Code Executions',
            'Unlimited AI Chat Queries',
            'Unlimited Video Solutions',
            'Unlimited Editorial Access',
            'Advanced Analytics',
            'Priority Support'
          ]
        },
        {
          type: 'yearly',
          name: 'Premium Yearly',
          amount: 1999,
          currency: 'INR',
          period: 'year',
          savings: '₹390 (16% off)',
          description: 'Best value - Save 16% with annual billing',
          features: [
            'All Monthly Features',
            'Save ₹390 per year',
            'Priority Support',
            'Early Access to New Features',
            'Exclusive Community Access'
          ],
          recommended: true
        }
      ]
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans'
    });
  }
};

const createSubscription = async (req, res) => {
  try {
    console.log('🔴 ===== CREATE SUBSCRIPTION CALLED =====');
    console.log('Request received at:', new Date().toISOString());
    console.log('User ID:', req.user?._id);
    console.log('User email:', req.user?.emailId);
    console.log('Request body:', req.body);
    console.log('Plan type:', req.body.planType);
    
    const { planType } = req.body;
    const userId = req.user._id; // Use _id, not id

    if (!['monthly', 'yearly'].includes(planType)) {
      console.log('❌ Invalid plan type:', planType);
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type. Choose monthly or yearly.'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User found:', user.emailId);

    if (user.isPremiumActive()) {
      console.log('⚠️ User already has active subscription');
      return res.status(400).json({
        success: false,
        message: 'You already have an active subscription',
        currentSubscription: {
          tier: user.subscriptionTier,
          validUntil: user.subscriptionEndDate
        }
      });
    }

    const plan = SUBSCRIPTION_PLANS[planType];
    
    console.log('📋 Using plan:', { planType, planId: plan.planId, amount: plan.amount });

    let customerId = user.razorpayCustomerId;
    
    if (!customerId) {
      console.log('📝 Creating new Razorpay customer...');
      const customer = await razorpayInstance.customers.create({
        name: `${user.firstName} ${user.lastName || ''}`.trim(),
        email: user.emailId,
        fail_existing: 0,
        notes: {
          userId: userId.toString(),
          platform: 'DSA Buddy'
        }
      });
      
      customerId = customer.id;
      user.razorpayCustomerId = customerId;
      await user.save();
      
      console.log('✅ Razorpay customer created:', customerId);
    }

    const subscriptionData = {
      plan_id: plan.planId,
      customer_id: customerId,
      total_count: planType === 'monthly' ? 12 : 1,
      quantity: 1,
      start_at: Math.floor(Date.now() / 1000) + 300,
      expire_by: Math.floor(Date.now() / 1000) + 1800,
      notes: {
        userId: userId.toString(),
        planType: planType,
        createdFrom: 'DSA Buddy Platform'
      }
    };

    console.log('📤 Creating Razorpay subscription with data:', subscriptionData);
    
    const subscription = await razorpayInstance.subscriptions.create(subscriptionData);

    console.log('✅ Razorpay subscription created:', subscription.id);

    const newSubscription = await Subscription.create({
      userId: userId,
      razorpaySubscriptionId: subscription.id,
      razorpayCustomerId: customerId,
      planId: plan.planId,
      planType: planType,
      status: 'created',
      amount: plan.amount,
      currency: 'INR',
      shortUrl: subscription.short_url,
      razorpayData: subscription
    });

    console.log('✅ Subscription saved to DB:', newSubscription._id);

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        subscriptionId: subscription.id,
        planType: planType,
        amount: plan.amount / 100,
        currency: 'INR',
        shortUrl: subscription.short_url
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Create subscription error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment details'
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Invalid payment signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment verification failed.'
      });
    }

    console.log('Payment signature verified successfully');

    const subscription = await Subscription.findOne({
      razorpaySubscriptionId: razorpay_subscription_id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    const rzpSubscription = await razorpayInstance.subscriptions.fetch(razorpay_subscription_id);

    console.log('Razorpay subscription status:', rzpSubscription.status);

    subscription.status = rzpSubscription.status;
    subscription.startDate = new Date(rzpSubscription.start_at * 1000);
    subscription.endDate = new Date(rzpSubscription.end_at * 1000);
    subscription.currentStart = new Date(rzpSubscription.current_start * 1000);
    subscription.currentEnd = new Date(rzpSubscription.current_end * 1000);
    subscription.nextBillingDate = rzpSubscription.charge_at ? 
      new Date(rzpSubscription.charge_at * 1000) : null;
    subscription.paidCount = rzpSubscription.paid_count;
    subscription.remainingCount = rzpSubscription.remaining_count;
    subscription.totalCount = rzpSubscription.total_count;
    await subscription.save();

    const user = await User.findById(subscription.userId);
    user.subscriptionTier = 'premium';
    user.subscriptionStartDate = subscription.startDate;
    user.subscriptionEndDate = subscription.endDate;
    user.razorpaySubscriptionId = razorpay_subscription_id;
    
    user.paymentHistory.push({
      paymentId: razorpay_payment_id,
      subscriptionId: razorpay_subscription_id,
      amount: subscription.amount,
      currency: subscription.currency,
      status: 'success',
      planType: subscription.planType,
      createdAt: new Date()
    });
    
    await user.save();

    console.log(`User ${user._id} upgraded to premium until ${subscription.endDate}`);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Welcome to Premium!',
      subscription: {
        status: 'active',
        tier: 'premium',
        validFrom: subscription.startDate,
        validUntil: subscription.endDate,
        planType: subscription.planType,
        nextBillingDate: subscription.nextBillingDate
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      'subscriptionTier subscriptionStartDate subscriptionEndDate usageLimits paymentHistory'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const subscription = await Subscription.findOne({
      userId: userId,
      status: { $in: ['active', 'authenticated'] }
    }).sort({ createdAt: -1 });

    const isPremium = user.isPremiumActive();

    let usageLimits = null;
    if (!isPremium) {
      usageLimits = {
        codeExecutions: {
          used: user.usageLimits.codeExecutions.used,
          limit: user.usageLimits.codeExecutions.limit,
          remaining: user.usageLimits.codeExecutions.limit - user.usageLimits.codeExecutions.used,
          percentage: Math.round((user.usageLimits.codeExecutions.used / user.usageLimits.codeExecutions.limit) * 100)
        },
        aiChatQueries: {
          used: user.usageLimits.aiChatQueries.used,
          limit: user.usageLimits.aiChatQueries.limit,
          remaining: user.usageLimits.aiChatQueries.limit - user.usageLimits.aiChatQueries.used,
          percentage: Math.round((user.usageLimits.aiChatQueries.used / user.usageLimits.aiChatQueries.limit) * 100)
        },
        videoSolutionViews: {
          used: user.usageLimits.videoSolutionViews.used,
          limit: user.usageLimits.videoSolutionViews.limit,
          remaining: user.usageLimits.videoSolutionViews.limit - user.usageLimits.videoSolutionViews.used,
          percentage: Math.round((user.usageLimits.videoSolutionViews.used / user.usageLimits.videoSolutionViews.limit) * 100)
        },
        editorialAccess: {
          used: user.usageLimits.editorialAccess.used,
          limit: user.usageLimits.editorialAccess.limit,
          remaining: user.usageLimits.editorialAccess.limit - user.usageLimits.editorialAccess.used,
          percentage: Math.round((user.usageLimits.editorialAccess.used / user.usageLimits.editorialAccess.limit) * 100)
        }
      };
    }

    res.status(200).json({
      success: true,
      subscription: {
        tier: user.subscriptionTier,
        isPremium: isPremium,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        status: subscription?.status || 'none',
        planType: subscription?.planType || null,
        nextBillingDate: subscription?.nextBillingDate || null
      },
      usageLimits: usageLimits,
      paymentHistory: user.paymentHistory.slice(-5).reverse()
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription status'
    });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.razorpaySubscriptionId) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    const cancelledSubscription = await razorpayInstance.subscriptions.cancel(
      user.razorpaySubscriptionId,
      { cancel_at_cycle_end: 1 }
    );

    await Subscription.findOneAndUpdate(
      { razorpaySubscriptionId: user.razorpaySubscriptionId },
      { 
        status: 'cancelled',
        cancelledAt: new Date()
      }
    );

    console.log(`Subscription ${user.razorpaySubscriptionId} cancelled for user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Subscription will be cancelled at the end of current billing cycle',
      details: {
        cancelledAt: new Date(),
        validUntil: user.subscriptionEndDate,
        note: 'You will continue to have premium access until the end date'
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getPlans,
  createSubscription,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription
};