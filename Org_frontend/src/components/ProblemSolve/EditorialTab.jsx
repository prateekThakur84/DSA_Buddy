import React, { useState } from 'react';
import { BookOpen, Lock, Zap, Crown } from 'lucide-react';
import { useSubscription } from "../../hooks/useSubscription";
import PaywallModal from "../common/PayWallModal";
import axiosInstance from "../../utils/axiosClient";

const EditorialTab = ({ problem }) => {
  const { isPremium, usageLimits, hasLimitReached } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [editorialUnlocked, setEditorialUnlocked] = useState(false);
  const [trackingError, setTrackingError] = useState(null);
  const [unlocking, setUnlocking] = useState(false);

  // Check if free user has reached editorial limit
  const editorialLimitReached = !isPremium && hasLimitReached('editorialAccess');

  // Handle unlock editorial
  const handleUnlockEditorial = async () => {
    try {
      setUnlocking(true);
      console.log("Unlocking editorial - sending request to backend");
      
      const response = await axiosInstance.post(
        `/api/usage/track/editorial/${problem._id}`
      );

      if (response.data.success) {
        setEditorialUnlocked(true);
        setTrackingError(null);
        console.log("✅ Editorial unlocked successfully - 1 credit used");
      }
    } catch (error) {
      console.error('Error unlocking editorial:', error);
      setTrackingError(error.response?.data?.message || 'Error unlocking editorial');
    } finally {
      setUnlocking(false);
    }
  };

  // Show paywall if limit reached
  if (editorialLimitReached) {
    return (
      <>
        <div className="relative w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 min-h-[400px] flex flex-col items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-sm opacity-30"
            style={{ 
              backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #0369a1 100%)'
            }}
          />
          
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6">
            <div className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/30">
              <Lock className="text-red-400" size={48} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Editorial Limit Reached</h3>
            <p className="text-slate-300 text-center mb-4 max-w-md text-sm">
              You've used all <span className="font-bold text-red-400">{usageLimits?.editorialAccess?.limit || 5}</span> free 
              editorial accesses. Upgrade to Premium for unlimited access!
            </p>

            {usageLimits?.editorialAccess && (
              <div className="bg-slate-800/50 rounded-lg p-3 mb-6 border border-slate-700">
                <div className="text-xs text-slate-400 mb-1">Your Usage</div>
                <div className="text-lg font-semibold text-white">
                  {usageLimits.editorialAccess.used} / {usageLimits.editorialAccess.limit} editorials accessed
                </div>
              </div>
            )}

            <button 
              onClick={() => setShowPaywall(true)}
              className="px-6 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 mb-3"
            >
              <Crown size={18} />
              Upgrade to Premium
            </button>

            <p className="text-xs text-slate-500">
              Get unlimited editorial content, code executions, video solutions & more!
            </p>
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
    <div className="relative space-y-3">
      {/* Premium Badge */}
      {isPremium ? (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="text-cyan-400" size={18} />
            <span className="text-xs font-medium text-white">Premium Member - Unlimited Access</span>
          </div>
        </div>
      ) : usageLimits?.editorialAccess ? (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs font-medium text-white">
                Credits Remaining: <span className="text-cyan-400 font-bold">{usageLimits.editorialAccess.remaining}</span> / {usageLimits.editorialAccess.limit}
              </span>
              {usageLimits.editorialAccess.remaining <= 2 && usageLimits.editorialAccess.remaining > 0 && (
                <p className="text-xs text-yellow-400 mt-1">
                  ⚠️ Low on credits! Upgrade to Premium for unlimited access.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {trackingError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs">
          ❌ {trackingError}
        </div>
      )}

      {/* Editorial Content Container */}
      <div className="rounded-lg overflow-hidden shadow-xl border border-slate-700 bg-slate-900">
        {/* Show content only when unlocked or premium */}
        {(editorialUnlocked || isPremium) ? (
          <div className="space-y-3 p-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <BookOpen size={18} />
                Editorial Solution
              </h3>
              <p className="text-slate-400 leading-relaxed text-xs">
                {problem.editorial?.approach || 'Detailed solution explanations will appear here.'}
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                📊 Complexity Analysis
              </h4>
              <div className="space-y-1 text-xs text-slate-300">
                <p><span className="text-cyan-400 font-medium">Time Complexity:</span> {problem.editorial?.timeComplexity || 'O(n)'}</p>
                <p><span className="text-cyan-400 font-medium">Space Complexity:</span> {problem.editorial?.spaceComplexity || 'O(1)'}</p>
              </div>
            </div>

            {problem.editorial?.approaches && (
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-xs font-semibold text-white mb-2">🎯 Approaches</h4>
                <div className="space-y-2">
                  {problem.editorial.approaches.map((approach, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded p-2 border border-slate-700">
                      <p className="text-cyan-400 font-medium text-xs mb-0.5">{approach.name}</p>
                      <p className="text-slate-400 text-xs">{approach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Placeholder when locked */
          <div className="w-full min-h-[300px] bg-slate-900" />
        )}
      </div>

      {/* ✅ FULL COMPONENT LOCK OVERLAY */}
      {!editorialUnlocked && !isPremium && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-lg p-6">
          <div className="text-center max-w-xs px-4">
            <div className="bg-cyan-500/20 p-4 rounded-full border border-cyan-500/40 w-fit mx-auto mb-4">
              <Lock className="text-cyan-400" size={40} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Editorial Content Locked</h3>
            
            <p className="text-slate-300 text-xs mb-4">
              Unlock detailed solution explanations, time complexity analysis, and multiple approaches to solve this problem.
            </p>
            
            <div className="bg-slate-800/50 rounded-lg p-3 mb-4 border border-slate-700">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="text-cyan-400" size={16} />
                <span className="text-xs font-semibold text-white">1 Credit Required</span>
              </div>
              <div className="text-xs text-slate-400">
                You have <span className="text-cyan-400 font-bold">{usageLimits?.editorialAccess?.remaining || 0}</span> credits available
              </div>
            </div>
            
            <button
              onClick={handleUnlockEditorial}
              disabled={unlocking}
              className={`w-full py-2 px-4 rounded-md text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 mb-2 ${
                unlocking
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/20'
              }`}
            >
              {unlocking ? (
                <>
                  <div className="animate-spin">⚙️</div>
                  Unlocking...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Unlock with 1 Credit
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowPaywall(true)}
              className="w-full py-2 px-4 rounded-md text-cyan-400 text-xs font-semibold border border-cyan-500/50 hover:border-cyan-400/80 hover:bg-cyan-400/10 transition-all flex items-center justify-center gap-2"
            >
              <Crown size={16} />
              Upgrade to Premium
            </button>
          </div>
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