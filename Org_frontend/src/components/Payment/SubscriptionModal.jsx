import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Check, Crown } from 'lucide-react';
import { fetchPlans, fetchPaymentPages } from '../../store/slices/subscriptionSlice';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { plans, paymentPages, error } = useSelector((state) => state.subscription);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPlans());
      dispatch(fetchPaymentPages());
    }
  }, [isOpen, dispatch]);

  // ✅ Redirect to Razorpay hosted payment page
  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Optional: Log attempt to backend
      await fetch('/api/payment/log-payment-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: selectedPlan })
      }).catch(() => null);

      const paymentLink =
        selectedPlan === 'monthly'
          ? paymentPages?.monthly
          : paymentPages?.yearly;

      if (paymentLink) {
        window.open(paymentLink, '_blank');
      } else {
        alert('Payment page not available. Please try again.');
      }
    } catch (error) {
      console.error('Error redirecting:', error);
      alert('Failed to redirect to payment page.');
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
                onClick={() => setSelectedPlan(plan.type)}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                      RECOMMENDED
                    </span>
                  </div>
                )}
                
                {/* Plan Header */}
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
                
                {/* Pricing */}
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
                
                {/* Features */}
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
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-600 rounded-md hover:border-slate-500 hover:bg-slate-800/30 transition-all"
              disabled={loading}
            >
              Maybe Later
            </button>
            <button
              onClick={handleSubscribe}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin">⚙️</div>
                  Redirecting...
                </>
              ) : (
                <>
                  <Crown size={16} />
                  Subscribe to {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'}
                </>
              )}
            </button>
          </div>
          
          {/* Terms */}
          <p className="text-center text-xs text-slate-500 mt-3">
            By subscribing, you agree to automatic renewal. Cancel anytime from settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
