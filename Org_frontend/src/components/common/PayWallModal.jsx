import React from 'react';
import { Crown, X, Zap, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

/**
 * Paywall Modal Component
 * Shows when user hits usage limit
 * Encourages upgrade to premium with benefits list
 * 
 * Props:
 * - isOpen: boolean - Controls modal visibility
 * - onClose: function - Callback to close modal
 * - feature: string - Name of the feature that hit limit
 * - usage: object - Usage details { used, limit, remaining }
 * 
 * Usage:
 * <PaywallModal 
 *   isOpen={showPaywall}
 *   onClose={() => setShowPaywall(false)}
 *   feature="Code Executions"
 *   usage={{ used: 25, limit: 25, remaining: 0 }}
 * />
 */
const PaywallModal = ({ isOpen, onClose, feature, usage }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/price');
  };

  const premiumBenefits = [
    "Unlimited Code Executions",
    "Unlimited AI Chat Support",
    "Unlimited Video Solutions",
    "Unlimited Editorial Content",
    "Advanced Analytics",
    "Priority Support"
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg shadow-2xl max-w-sm w-full p-6 border border-slate-700 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-full">
            <Crown className="text-white" size={32} />
          </div>
        </div>

        {/* Title */}
        {/* <h2 className="text-xl font-bold text-center text-white mb-1">
          Limit Reached!
        </h2> */}

        {/* Message */}
        {/* <p className="text-center text-xs text-slate-400 mb-4">
          You've used all {usage?.limit || 0} free {feature}
        </p> */}

        {/* Benefits Box */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-4">
          <p className="font-semibold text-xs text-white mb-2 flex items-center gap-1.5">
            <Zap className="text-cyan-400" size={14} />
            With Premium:
          </p>
          <ul className="space-y-1.5 text-xs">
            {premiumBenefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="text-cyan-400 flex-shrink-0 mt-0.5" size={12} />
                <span className="text-slate-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="text-center mb-4 bg-cyan-500/5 border border-cyan-400/20 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-0.5">Starting at</p>
          <p className="text-2xl font-bold text-cyan-400">
            ₹199<span className="text-xs text-slate-400">/month</span>
          </p>
          <p className="text-xs text-cyan-400 font-semibold mt-0.5">or ₹1,999/year (Save 16%)</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={handleUpgrade}
            className="w-full py-2 px-3 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Crown size={16} />
            Upgrade to Premium
          </button>
          <button 
            onClick={onClose}
            className="w-full py-2 px-3 rounded-md border border-slate-600 text-slate-300 text-xs font-semibold hover:border-slate-500 hover:bg-slate-800/30 transition-all"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;