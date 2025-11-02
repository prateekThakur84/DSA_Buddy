import React, { useState, useEffect } from 'react';
import { BookOpen, Crown, Lock } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import PaywallModal from '../common/PayWallModal';
import axiosInstance from '../../utils/axios';

const EditorialTab = ({ problem }) => {
  const { isPremium, usageLimits, hasLimitReached } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [editorial, setEditorial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);

  // Check if free user has reached editorial limit
  const editorialLimitReached = !isPremium && hasLimitReached('editorialAccess');

  // Load editorial when tab opens
  useEffect(() => {
    if (problem && editorial === null && !editorialLimitReached) {
      loadEditorial();
    }
  }, [problem, editorialLimitReached]);

  const loadEditorial = async () => {
    try {
      setLoading(true);
      
      // Track editorial access
      const trackResponse = await axiosInstance.post(
        `/api/usage/track/editorial/${problem._id}`
      );

      if (trackResponse.data.success) {
        // Load editorial content (assuming it exists in problem object)
        setEditorial(problem.editorial || {
          approach: 'Editorial content coming soon',
          complexity: 'To be added',
          solutions: []
        });
        setTrackingError(null);
      }
    } catch (error) {
      console.error('Error loading editorial:', error);
      setTrackingError(error.response?.data?.message || 'Error loading editorial');
    } finally {
      setLoading(false);
    }
  };

  // Show paywall if limit reached
  if (editorialLimitReached) {
    return (
      <>
        <div className="relative rounded-lg overflow-hidden border border-red-500/30 bg-gray-900 p-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-4 rounded-full mb-4 border border-red-500/30 w-fit mx-auto">
              <Lock className="text-red-400" size={48} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Editorial Limit Reached</h3>
            <p className="text-gray-300 text-center mb-4 max-w-md">
              You've used all <span className="font-bold text-red-400">{usageLimits?.editorialAccess?.limit || 5}</span> free 
              editorial accesses. Upgrade to Premium for unlimited access!
            </p>

            {usageLimits?.editorialAccess && (
              <div className="bg-gray-800/50 rounded-lg p-3 mb-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Your Usage</div>
                <div className="text-lg font-semibold text-white">
                  {usageLimits.editorialAccess.used} / {usageLimits.editorialAccess.limit} editorials accessed
                </div>
              </div>
            )}

            <button 
              onClick={() => setShowPaywall(true)}
              className="btn bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none hover:from-yellow-600 hover:to-orange-600 px-8 py-3"
            >
              <Crown size={20} />
              Upgrade to Premium
            </button>
          </div>
        </div>

        <PaywallModal 
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          feature="Editorial Content"
          usage={usageLimits?.editorialAccess}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      {isPremium ? (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-2">
          <Crown className="text-yellow-500" size={20} />
          <span className="text-sm font-medium text-white">Premium Member - Unlimited Access</span>
        </div>
      ) : usageLimits?.editorialAccess && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <span className="text-sm font-medium text-white">
            Free Tier: {usageLimits.editorialAccess.remaining} / {usageLimits.editorialAccess.limit} editorials remaining
          </span>
        </div>
      )}

      {trackingError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
          {trackingError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      ) : editorial ? (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpen size={20} />
              Editorial Solution
            </h3>
            <p className="text-gray-300">{editorial.approach || 'Coming soon...'}</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-sm font-semibold text-white mb-2">Complexity Analysis</h4>
            <p className="text-gray-300 text-sm">{editorial.complexity || 'Coming soon...'}</p>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-slate-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold mb-2">Editorial Coming Soon</p>
        </div>
      )}

      <PaywallModal 
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Editorial Content"
        usage={usageLimits?.editorialAccess}
      />
    </div>
  );
};

export default EditorialTab;
