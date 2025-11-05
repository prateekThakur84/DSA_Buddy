import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/payment/subscription-status');
        setSubscriptionData(response.data.subscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <span className="text-cyan-400 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-cyan-400/30 p-8 text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>
              <CheckCircle className="w-20 h-20 text-green-400 relative" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-cyan-300 text-lg mb-8">Welcome to DSA Buddy Premium 🎉</p>

          {subscriptionData && (
            <div className="bg-black/50 rounded-lg p-6 mb-8 text-left space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Plan</p>
                  <p className="text-white font-semibold text-lg capitalize">
                    {subscriptionData.planType} Plan
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Status</p>
                  <p className="text-green-400 font-semibold text-lg">✓ Active</p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-sm">Valid From</p>
                <p className="text-white font-semibold">
                  {new Date(subscriptionData.startDate).toLocaleDateString('en-IN')}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Valid Until</p>
                <p className="text-white font-semibold">
                  {new Date(subscriptionData.endDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-white font-semibold mb-4">Your Premium Benefits:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Unlimited Code Executions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Unlimited AI Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Unlimited Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">Priority Support</span>
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-8">
            A receipt has been sent to your email. Check your inbox or spam folder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <ArrowRight size={18} />
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/problems')}
              className="px-6 py-3 border border-cyan-400/50 text-cyan-300 font-semibold rounded-lg hover:bg-cyan-400/10 transition-all"
            >
              Start Solving Problems
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-3">What's Next?</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>✓ Your premium status is now active</li>
            <li>✓ All limits have been removed</li>
            <li>✓ Start solving unlimited problems</li>
            <li>✓ Your subscription auto-renews on the billing date</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
