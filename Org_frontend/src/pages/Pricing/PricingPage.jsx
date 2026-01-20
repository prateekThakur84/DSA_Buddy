import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Check, ArrowRight, HelpCircle, 
  Terminal, Sparkles, Plus, 
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import SubscriptionModal from '../../components/Payment/SubscriptionModal';

const PricingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleGetStarted = (planType) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (planType === 'Premium') {
      setShowModal(true);
    } else {
      navigate('/problems');
    }
  };

  // --- Configuration ---
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: '/forever',
      description: 'Essential tools for getting started.',
      buttonText: 'Start Coding',
      buttonVariant: 'outline',
      icon: Terminal,
      features: [
        "Access to all problems",
        "25 code executions", // Removed /mo
        "10 AI chat queries", // Removed /mo
        "Community support",
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹199',
      period: '/month',
      description: 'Full power for serious interview prep.',
      buttonText: 'Upgrade Now',
      buttonVariant: 'gradient',
      highlight: true,
      icon: Crown,
      features: [
        "Unlimited executions",
        "Unlimited AI assistance",
        "Video solutions",
        "Priority support",
      ]
    }
  ];

  const faqItems = [
    {
      id: 1,
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time. You'll continue to have premium access until the end of your billing period."
    },
    {
      id: 2,
      question: "Do usage limits reset?",
      answer: "Free tier limits reset monthly. Premium users enjoy unlimited access to all features instantly."
    },
    {
      id: 3,
      question: "Is there a student discount?",
      answer: "We are working on special pricing for students! Contact support with your student ID for early access."
    },
    {
      id: 4,
      question: "Can I get a refund?",
      answer: "We offer a 7-day money-back guarantee if you are not satisfied with the Premium features. No questions asked."
    },
    {
      id: 5,
      question: "Do you offer team plans?",
      answer: "Yes, for campus or corporate training, please reach out to our sales team for custom bulk pricing."
    },
    {
      id: 6,
      question: "What currency is the billing in?",
      answer: "All billing is currently processed in INR (Indian Rupee) via Razorpay, supporting UPI, Cards, and Netbanking."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
      
      <Navigation />
      {/* --- BACKGROUND: CYBER GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B1120] to-[#000000]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-7xl">
        
        {/* --- Heading Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
              <Sparkles size={12} />
              <span>Flexible Plans</span>
           </div>
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Transparent Pricing
          </h2>
          <p className="text-slate-400 text-sm">
            Start for free, upgrade to accelerate your journey.
          </p>
        </motion.div>

        {/* --- 2 Column Pricing Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 items-center justify-center max-w-3xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // Compact Padding: p-6 instead of p-8
              className={`relative flex flex-col p-6 rounded-3xl border transition-all duration-300 group ${
                plan.highlight 
                  ? 'bg-[#0B1120]/80 border-cyan-500/40 shadow-2xl shadow-cyan-900/20 scale-[1.02] z-10' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Highlight Badge */}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles size={10} /> Recommended
                </div>
              )}

              {/* Header - Compact margins */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className={`p-2 rounded-lg ${
                    plan.highlight ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <plan.icon size={18} />
                  </div>
                </div>
                <p className="text-xs text-slate-400">{plan.description}</p>
              </div>

              {/* Price - Compact margins */}
              <div className="mb-6 pb-4 border-b border-slate-800/50">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-200'}`}>
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                </div>
              </div>

              {/* Features - Reduced spacing */}
              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className={`p-0.5 rounded-full mt-0.5 flex-shrink-0 ${
                      plan.highlight ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 bg-slate-800'
                    }`}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span className={`text-xs leading-tight ${plan.highlight ? 'text-slate-300' : 'text-slate-400'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button - Compact height */}
              <button
                onClick={() => handleGetStarted(plan.name)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.buttonVariant === 'gradient'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-900/20 hover:scale-[1.02] active:scale-95'
                    : 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 hover:border-slate-600 hover:text-white active:bg-slate-800'
                }`}
              >
                {plan.buttonText}
                {plan.highlight && <ArrowRight size={14} />}
              </button>
            </motion.div>
          ))}
        </div>

        {/* --- FAQ Section (Compact) --- */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6 justify-center text-slate-400">
            <HelpCircle size={16} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Common Questions</h3>
          </div>
          
          <div className="grid gap-2">
            {faqItems.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                  className="w-full px-5 py-3 flex items-center justify-between text-left group"
                >
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.question}</span>
                  <div className={`text-slate-500 transition-transform duration-300 ${expandedFAQ === item.id ? 'rotate-45' : ''}`}>
                    <Plus size={16} />
                  </div>
                </button>
                
                <motion.div 
                  initial={false}
                  animate={{ height: expandedFAQ === item.id ? "auto" : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-0 text-slate-400 text-xs leading-relaxed border-t border-slate-800/50 mt-1 pt-3">
                    {item.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Subscription Modal */}
      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default PricingPage;