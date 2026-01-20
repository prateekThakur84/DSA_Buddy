import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Check, Crown, AlertCircle, Sparkles, Loader2, CreditCard,ShieldCheck  } from 'lucide-react';
import { fetchPlans } from '../../store/slices/subscriptionSlice';
import axiosClient from '../../utils/axiosClient';
import { motion, AnimatePresence } from 'framer-motion';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { plans, error: reduxError } = useSelector((state) => state.subscription);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Configuration for plans to match Pricing Page
  const planDetails = {
    monthly: {
      price: '₹199',
      period: '/month',
      label: 'Monthly Plan',
      savings: null
    },
    yearly: {
      price: '₹1,999',
      period: '/year',
      label: 'Yearly Plan',
      savings: 'Save 16%'
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPlans());
      setPaymentError(null);
    }
  }, [isOpen, dispatch]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setPaymentError(null);

      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Please login to continue.');

      // 1. Create Subscription
      const { data } = await axiosClient.post(
        '/payment/create-subscription',
        { planType: selectedPlan }
      );

      const { subscription, razorpayKeyId } = data;
      
      if (!window.Razorpay) throw new Error('Payment gateway failed to load.');

      // 2. Open Razorpay
      const options = {
        key: razorpayKeyId,
        subscription_id: subscription.subscriptionId,
        name: 'DSA Buddy Premium',
        description: `${selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Access`,
        theme: { color: '#06b6d4' }, // Cyan-500
        handler: async function (response) {
           // Success handler - usually you verify signature here
           // For now, we rely on webhook or polling, but this is immediate UI feedback
           onClose();
           window.location.reload(); 
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setPaymentError(response.error.description);
        setLoading(false);
      });
      
      rzp.open();

    } catch (err) {
      console.error('Subscription Error:', err);
      setPaymentError(err.response?.data?.message || err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0B1120] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-slate-800 bg-slate-900/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
              
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Crown className="text-amber-400 fill-amber-400/20" size={20} />
                    Upgrade to Premium
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Unlock your full coding potential.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              
              {/* Payment Loading State */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin relative z-10" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Processing Payment</h3>
                  <p className="text-slate-400 text-sm max-w-xs">Please complete the transaction in the Razorpay window.</p>
                </div>
              ) : (
                <>
                  {/* Plan Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {['monthly', 'yearly'].map((type) => {
                      const isActive = selectedPlan === type;
                      const plan = planDetails[type];
                      
                      return (
                        <div
                          key={type}
                          onClick={() => setSelectedPlan(type)}
                          className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                            isActive 
                              ? 'bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]' 
                              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {isActive && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-cyan-500 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                              <Check size={10} strokeWidth={4} /> Selected
                            </div>
                          )}
                          {type === 'yearly' && (
                            <div className="absolute top-2 right-2 text-[10px] font-bold text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded border border-green-500/30">
                              -16%
                            </div>
                          )}
                          
                          <div className="text-sm font-medium text-slate-400 mb-1 capitalize">{type}</div>
                          <div className="flex items-baseline gap-0.5">
                            <span className={`text-xl font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                              {plan.price}
                            </span>
                            <span className="text-[10px] text-slate-500">{plan.period}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 mb-6">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white font-medium">{planDetails[selectedPlan].price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-4">
                      <span className="text-slate-400">Tax</span>
                      <span className="text-white font-medium">Included</span>
                    </div>
                    <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
                      <span className="text-white font-bold">Total Due</span>
                      <div className="text-right">
                        <span className="text-xl font-bold text-cyan-400">{planDetails[selectedPlan].price}</span>
                        <p className="text-[10px] text-slate-500">Auto-renews {selectedPlan}</p>
                      </div>
                    </div>
                  </div>

                  {/* Errors */}
                  {(paymentError || reduxError) && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>{paymentError || reduxError}</p>
                    </div>
                  )}

                  {/* Action */}
                  <button
                    onClick={handleSubscribe}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CreditCard size={18} />
                    Complete Payment
                  </button>
                  
                  <p className="text-center text-[10px] text-slate-600 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Secure payment via Razorpay
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;