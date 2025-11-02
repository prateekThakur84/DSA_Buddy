import React, { useState } from 'react';
import { Crown, Check, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import SubscriptionModal from '../../components/Payment/SubscriptionModal';

/**
 * Pricing Page Component - Ice Theme Version (Compact)
 * Full-featured pricing comparison page with ice blue color scheme
 * Displays Free vs Premium plans with FAQ section
 * 
 * Route: /pricing
 */
const PricingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    } else {
      setShowModal(true);
    }
  };

  const faqItems = [
    {
      id: 1,
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time. You'll continue to have premium access until the end of your billing period."
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay's secure payment gateway."
    },
    {
      id: 3,
      question: "Do usage limits reset?",
      answer: "No, free tier limits are lifetime limits per account. Upgrade to Premium for unlimited access to all features."
    },
    {
      id: 4,
      question: "Can I upgrade from monthly to yearly?",
      answer: "Yes! Contact support and we'll help you switch to the yearly plan and pro-rate your remaining monthly subscription."
    },
    {
      id: 5,
      question: "What happens after my trial or limit runs out?",
      answer: "You can continue using the platform with read-only access to problems, but won't be able to execute code, use AI chat, or access video solutions until you upgrade."
    },
    {
      id: 6,
      question: "Is there a student discount?",
      answer: "We're working on special pricing for students! Contact us at support@dsabuddy.com with your student ID for early access to student plans."
    }
  ];

  const freeFeatures = [
    "Access to all problems",
    "25 code executions",
    "10 AI chat queries",
    "5 video solutions",
    "5 editorial accesses",
    "Basic analytics"
  ];

  const premiumFeatures = [
    "Unlimited code executions",
    "Unlimited AI chat queries",
    "Unlimited video solutions",
    "Unlimited editorial content",
    "Advanced analytics",
    "Priority support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 py-8 px-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animation-delay-2000 animate-pulse"></div>

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-4">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-xs font-semibold text-cyan-300">Flexible Pricing Plans</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
          Choose the plan that's right for you
        </p>
      </div>

      {/* Plans Section - Single Row Layout */}
      <div className="max-w-5xl mx-auto mb-10 relative z-10">
  <div className="grid md:grid-cols-2 gap-4">
    
    {/* Free Tier Card */}
    <div className="glass-ice rounded-lg p-4 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 flex flex-col h-full">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-white mb-0.5">Free</h3>
        <p className="text-slate-300 text-[11px]">Perfect for getting started</p>
      </div>
      
      <div className="mb-3">
        <div className="text-2xl font-bold text-cyan-400">₹0</div>
        <p className="text-[11px] text-slate-400 mt-0.5">/forever</p>
      </div>
      
      <button 
        onClick={() => navigate('/auth/signup')}
        className="w-full py-1.5 px-2.5 rounded-md border border-cyan-400/50 text-cyan-300 font-semibold hover:bg-cyan-400/10 transition-all duration-300 mb-3 text-xs flex items-center justify-center gap-1.5"
      >
        Get Started
        <ArrowRight size={12} />
      </button>

      <div className="space-y-1.5 flex-grow">
        {freeFeatures.map((feature, index) => (
          <div key={index} className="flex items-start gap-1.5">
            <Check className="text-cyan-400 flex-shrink-0 mt-0.5" size={12} />
            <span className="text-slate-200 text-[11px]">{feature}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Premium Tier Card - Featured */}
    <div className="group relative">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-400 rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
      
      <div className="relative glass-ice-strong rounded-lg p-4 border border-cyan-400/40 flex flex-col h-full">
        {/* Premium Badge */}
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 w-fit mb-2">
          <Crown size={10} className="text-cyan-300" />
          <span className="text-[10px] font-bold text-cyan-300">RECOMMENDED</span>
        </div>
        
        <div className="mb-2">
          <h3 className="text-lg font-bold text-white mb-0.5">Premium</h3>
          <p className="text-cyan-200 text-[11px]">For serious learners</p>
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">
            ₹199
          </div>
          <p className="text-[11px] text-cyan-200 mt-0.5">/month or ₹1,999/year</p>
          <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">Save 16% on yearly</p>
        </div>
        
        <button 
          onClick={handleGetStarted}
          className="w-full py-1.5 px-2.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 mb-3 text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          <Crown size={12} />
          Upgrade
        </button>

        <div className="space-y-1.5 flex-grow">
          <div className="flex items-start gap-1.5 pb-1 border-b border-cyan-400/20">
            <Zap className="text-cyan-300 flex-shrink-0 mt-0.5" size={12} />
            <span className="text-cyan-200 font-semibold text-[10px]">Everything in Free, plus:</span>
          </div>
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-1.5">
              <Check className="text-cyan-300 flex-shrink-0 mt-0.5" size={12} />
              <span className="text-slate-200 text-[11px]">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Why Upgrade Section */}
      <div className="max-w-6xl mx-auto mb-12 relative z-10">
        <div className="glass-ice rounded-xl p-6 border border-cyan-400/20">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Why Upgrade to Premium?</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto mb-3">
                <Zap className="text-cyan-400" size={20} />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Unlimited Executions</h4>
              <p className="text-xs text-slate-400">Run code as much as you need</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="text-cyan-400" size={20} />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">AI Assistance</h4>
              <p className="text-xs text-slate-400">Get unlimited AI-powered hints</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto mb-3">
                <Crown className="text-cyan-400" size={20} />
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Priority Support</h4>
              <p className="text-xs text-slate-400">Get help whenever you need it</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-12 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">FAQ</h2>
          <p className="text-slate-400 text-sm">Have questions? We've got answers</p>
        </div>
        
        <div className="space-y-2">
          {faqItems.map((item) => (
            <div 
              key={item.id}
              className="glass-ice rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-cyan-500/5 transition-colors"
              >
                <h3 className="font-semibold text-white text-left text-sm">{item.question}</h3>
                <div className={`text-cyan-400 flex-shrink-0 transition-transform duration-300 ${expandedFAQ === item.id ? 'rotate-180' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
              
              {expandedFAQ === item.id && (
                <div className="px-4 py-3 border-t border-cyan-400/20 bg-cyan-500/5 text-slate-300 text-xs">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-ice-strong rounded-xl p-8 border border-cyan-400/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to master DSA?
          </h2>
          <p className="text-slate-300 mb-5 text-sm">
            Join thousands of developers mastering data structures and algorithms
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleGetStarted}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 text-sm"
            >
              <Crown size={18} />
              Start Premium
            </button>
            <button 
              onClick={() => navigate('/auth/signup')}
              className="px-6 py-2 rounded-lg border border-cyan-400/50 text-cyan-300 font-semibold hover:bg-cyan-400/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              Try Free
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default PricingPage;