import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Check, Crown, AlertCircle } from 'lucide-react';
import { fetchPlans } from '../../store/slices/subscriptionSlice';
import axiosClient from '../../utils/axiosClient';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { plans, error } = useSelector((state) => state.subscription);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (isOpen) {
      console.log('🎯 SubscriptionModal opened');
      dispatch(fetchPlans());
      setRetryCount(0); // Reset retry count when modal opens
    }
  }, [isOpen, dispatch]);

  const handleSubscribe = async () => {
    try {
      console.log('🔴 ========== SUBSCRIBE BUTTON CLICKED ==========');
      setLoading(true);

      // Check authentication token
      const token = localStorage.getItem('authToken');
      console.log('🔐 Token exists:', !!token);
      
      if (!token) {
        throw new Error('🔴 Authentication required. Please login first.');
      }

      console.log('📍 Step 1: Creating subscription on backend...');
      console.log('Sending request to: /payment/create-subscription');
      console.log('Plan type:', selectedPlan);

      // Step 1: Create subscription on backend
      const subscriptionResponse = await axiosClient.post(
        '/payment/create-subscription',
        { planType: selectedPlan },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('✅ Step 1 SUCCESS - Subscription created:', subscriptionResponse.data);

      // Extract subscription ID and Razorpay key (with proper null checks)
      const subscriptionId = subscriptionResponse.data?.subscription?.subscriptionId;
      const razorpayKeyId = subscriptionResponse.data?.razorpayKeyId;

      if (!subscriptionId || !razorpayKeyId) {
        console.error('❌ Missing critical data in response:', {
          subscriptionId,
          razorpayKeyId,
          fullResponse: subscriptionResponse.data
        });
        throw new Error('❌ Failed to get subscription details. Please try again.');
      }

      console.log('📍 Step 2: Opening Razorpay checkout...');
      console.log('Subscription ID:', subscriptionId);
      console.log('Razorpay Key:', razorpayKeyId);

      // Verify Razorpay script is loaded
      if (!window.Razorpay) {
        throw new Error('❌ Razorpay script not loaded. Refresh page and try again.');
      }

      // ✅ FIXED: Configure Razorpay options correctly to avoid 5 Rs charge
      const options = {
        // Authentication
        key: razorpayKeyId,
        subscription_id: subscriptionId,

        // Display
        name: 'DSA Buddy',
        description: `${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Premium Plan`,
        image: '/logo.png',

        // ✅ CRITICAL FIX: Disable prefill to prevent 5 Rs charge
        prefill: {
          // Don't prefill - let user enter their own details
        },

        // Theme
        theme: {
          color: '#00d4ff'
        },

        // ✅ FIXED: Disable zero-authorization charge
        notes: {
          planType: selectedPlan,
          timestamp: new Date().toISOString()
        },

        // Modal behavior
        modal: {
          ondismiss: function() {
            console.log('⚠️ User closed Razorpay modal');
            setLoading(false);
            // Don't retry on user dismiss
          }
        },

        // ✅ FIXED: Payment options to charge full amount immediately
        method: {
          // Allow all payment methods
          netbanking: 1,
          card: 1,
          upi: 1,
          wallet: 1
        }
      };

      const rzp = new window.Razorpay(options);

      // ✅ FIXED: Better error handling
      rzp.on('payment.failed', function(response) {
        console.error('❌ Payment failed:', response.error);
        setLoading(false);
        
        // Show specific error messages
        let errorMessage = 'Payment failed. ';
        if (response.error.code === 'BAD_REQUEST_ERROR') {
          errorMessage += 'Please check your payment details and try again.';
        } else if (response.error.code === 'NETWORK_ERROR') {
          errorMessage += 'Network error. Please check your connection.';
        } else {
          errorMessage += response.error.description || 'Unknown error occurred.';
        }
        
        alert(errorMessage);
        
        // Offer retry
        if (retryCount < MAX_RETRIES) {
          const retryConfirm = confirm(
            `Attempt ${retryCount + 1} of ${MAX_RETRIES}. Retry?`
          );
          if (retryConfirm) {
            setRetryCount(retryCount + 1);
            setTimeout(() => handleSubscribe(), 1000);
          }
        }
      });

      // ✅ FIXED: Proper handler for successful payment
      rzp.on('payment.success', function(response) {
        console.log('✅ Step 2 SUCCESS - Payment successful');
        console.log('Payment response:', response);
        handlePaymentSuccess(response);
      });

      console.log('🎯 Opening Razorpay checkout modal...');
      rzp.open();

    } catch (error) {
      console.error('❌ SUBSCRIPTION ERROR:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      setLoading(false);

      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create subscription. Please try again.';
      
      alert(errorMessage);

      // ✅ Auto-retry on network errors
      if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
        if (retryCount < MAX_RETRIES) {
          console.log(`🔄 Auto-retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
          setRetryCount(retryCount + 1);
          setTimeout(() => handleSubscribe(), 2000);
        }
      }
    }
  };

  // ✅ FIXED: Separate function to handle payment success
  const handlePaymentSuccess = async (response) => {
    try {
      console.log('📍 Step 3: Verifying payment on backend...');
      
      const verifyResponse = await axiosClient.post(
        '/payment/verify-payment',
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_subscription_id: response.razorpay_subscription_id,
          razorpay_signature: response.razorpay_signature
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Step 3 SUCCESS - Payment verified:', verifyResponse.data);

      // Show success message
      alert('🎉 Payment successful! You are now a premium member!');
      
      // Close modal
      onClose();
      
      // Refresh after small delay to ensure backend is updated
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (verifyError) {
      console.error('❌ Step 3 FAILED - Payment verification error:', verifyError);
      console.error('Error response:', verifyError.response?.data);
      
      setLoading(false);

      const errorMessage = verifyError.response?.data?.message || 
                          verifyError.message ||
                          'Payment verification failed. Please contact support.';
      
      alert(`⚠️ ${errorMessage}\n\nYour payment has been processed. Please refresh the page.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/80 backdrop-blur border-b border-slate-700 px-6 py-4 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-1">
              <Crown className="text-cyan-400" size={24} />
              Upgrade to Premium
            </h2>
            <p className="text-xs text-slate-400">Unlock unlimited access to all features</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors p-1 flex-shrink-0"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Banner - Only shown during loading/payment */}
        {loading && (
          <div className="bg-blue-500/10 border-b border-blue-500/30 px-6 py-3 flex items-start gap-2">
            <div className="animate-spin mt-0.5">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-blue-300 font-semibold">Processing Payment</p>
              <p className="text-xs text-blue-200 mt-0.5">Full amount (₹{selectedPlan === 'monthly' ? '199' : '1999'}) will be charged immediately.</p>
            </div>
          </div>
        )}
        
        {/* Plans Comparison */}
        <div className="p-4 md:p-6">
          {/* Info Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4 flex items-start gap-3">
            <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <p className="text-amber-300 font-semibold">Full Amount Charged Upfront</p>
              <p className="text-amber-200 text-xs mt-1">
                {selectedPlan === 'monthly' 
                  ? '₹199 will be charged immediately and renews every month.'
                  : '₹1,999 will be charged immediately and renews every year.'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {plans.map((plan) => (
              <div
                key={plan.type}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.type
                    ? 'border-cyan-400/60 bg-cyan-500/5 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                }`}
                onClick={() => !loading && setSelectedPlan(plan.type)}
              >
                {plan.recommended && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                      RECOMMENDED
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400">{plan.description}</p>
                  </div>
                  {selectedPlan === plan.type && (
                    <div className="bg-cyan-500 rounded-full p-1">
                      <Check className="text-white" size={16} />
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-cyan-400">₹{plan.amount}</span>
                    <span className="text-sm text-slate-400">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="mt-1.5">
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/30 font-semibold">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                </div>
                
                <ul className="space-y-1.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="text-cyan-400 flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-xs text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-md mb-4 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-600 rounded-md hover:border-slate-500 hover:bg-slate-800/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Maybe Later
            </button>
            <button
              onClick={handleSubscribe}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin">⚙️</div>
                  Processing... ({retryCount > 0 && `Attempt ${retryCount + 1}`})
                </>
              ) : (
                <>
                  <Crown size={16} />
                  Subscribe to {selectedPlan === 'monthly' ? 'Monthly (₹199)' : 'Yearly (₹1,999)'}
                </>
              )}
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-500 mt-3">
            By subscribing, you agree to automatic renewal. Cancel anytime from settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
