import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Check, Crown } from 'lucide-react';
import { fetchPlans, fetchPaymentPages } from '../../store/slices/subscriptionSlice';
import axiosClient from '../../utils/axiosClient';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { plans, paymentPages, error, paymentLoading } = useSelector((state) => state.subscription);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('🎯 SubscriptionModal opened');
      dispatch(fetchPlans());
      dispatch(fetchPaymentPages());
    }
  }, [isOpen, dispatch]);

  // ✅ FIXED: Properly extract response data
  const handleSubscribe = async () => {
    try {
      console.log('🔴 ========== SUBSCRIBE BUTTON CLICKED ==========');
      setLoading(true);

      // Check token
      const token = localStorage.getItem('authToken');
      console.log('🔐 Token exists:', !!token);
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('📍 Step 1: Creating subscription on backend...');
      console.log('Sending request to: /payment/create-subscription');
      console.log('Plan type:', selectedPlan);

      // Step 1: Create subscription on backend
      const subscriptionResponse = await axiosClient.post('/payment/create-subscription', {
        planType: selectedPlan
      });

      console.log('✅ Step 1 SUCCESS - Subscription created:', subscriptionResponse.data);

      // ✅ FIXED: Extract from correct location
      const subscriptionId = subscriptionResponse.data.subscription.subscriptionId;
      const razorpayKeyId = subscriptionResponse.data.razorpayKeyId;

      if (!subscriptionId || !razorpayKeyId) {
        console.error('❌ Missing data in response:', {
          subscriptionId,
          razorpayKeyId,
          fullResponse: subscriptionResponse.data
        });
        throw new Error('Missing subscription ID or Razorpay key from response');
      }

      console.log('📍 Step 2: Opening Razorpay checkout...');
      console.log('Subscription ID:', subscriptionId);
      console.log('Razorpay Key:', razorpayKeyId);

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded! Make sure to include the script in your HTML');
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: 'DSA Buddy',
        description: `${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Premium Plan`,
        image: '/logo.png',
        theme: {
          color: '#00d4ff'
        },
        handler: async function(response) {
          console.log('✅ Step 2 SUCCESS - Payment successful');
          console.log('Payment response:', response);

          // Step 3: Verify payment
          try {
            console.log('📍 Step 3: Verifying payment on backend...');
            
            const verifyResponse = await axiosClient.post('/payment/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            });

            console.log('✅ Step 3 SUCCESS - Payment verified:', verifyResponse.data);

            alert('🎉 Payment successful! You are now a premium member!');
            onClose();
            window.location.reload();
          } catch (verifyError) {
            console.error('❌ Step 3 FAILED - Payment verification error:', verifyError);
            console.error('Error response:', verifyError.response?.data);
            console.error('Error message:', verifyError.message);
            alert('Payment verification failed: ' + (verifyError.response?.data?.message || verifyError.message));
          }
        },
        modal: {
          ondismiss: function() {
            console.log('⚠️ User closed Razorpay modal');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      // Handle payment error
      rzp.on('payment.failed', function(response) {
        console.error('❌ Razorpay payment failed:', response.error);
        setLoading(false);
        alert('Payment failed: ' + response.error.description);
      });

      console.log('🎯 Opening Razorpay modal...');
      rzp.open();

    } catch (error) {
      console.error('❌ SUBSCRIPTION ERROR:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      alert(error.response?.data?.message || error.message || 'Failed to create subscription. Please try again.');
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
            disabled={loading || paymentLoading}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Plans Comparison */}
        <div className="p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {plans.map((plan) => (
              <div
                key={plan.type}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.type
                    ? 'border-cyan-400/60 bg-cyan-500/5 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                }`}
                onClick={() => !loading && !paymentLoading && setSelectedPlan(plan.type)}
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
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-600 rounded-md hover:border-slate-500 hover:bg-slate-800/30 transition-all disabled:opacity-50"
              disabled={loading || paymentLoading}
            >
              Maybe Later
            </button>
            <button
              onClick={handleSubscribe}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              disabled={loading || paymentLoading}
            >
              {loading || paymentLoading ? (
                <>
                  <div className="animate-spin">⚙️</div>
                  Processing...
                </>
              ) : (
                <>
                  <Crown size={16} />
                  Subscribe to {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'}
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
