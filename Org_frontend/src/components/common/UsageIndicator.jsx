import React, { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { AlertCircle, Crown } from 'lucide-react';
import SubscriptionModal from '../Payment/SubscriptionModal';

/**
 * Usage Indicator Component
 * Displays usage progress bars and warnings for free users
 * Shows premium badge for premium users
 * 
 * Usage:
 * <UsageIndicator />
 */
const UsageIndicator = () => {
  const { usageLimits, isPremium } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  // Don't show for premium users - show premium badge instead
  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
        <Crown size={20} />
        <span className="font-semibold">Premium Member</span>
      </div>
    );
  }

  if (!usageLimits) return null;

  // Define all features to track
  const features = [
    { name: 'Code Executions', key: 'codeExecutions' },
    { name: 'AI Queries', key: 'aiChatQueries' },
    { name: 'Video Solutions', key: 'videoSolutionViews' },
    { name: 'Editorials', key: 'editorialAccess' }
  ];

  // Find features that are approaching or at limit (60%+)
  const warnings = features
    .map(f => ({
      ...f,
      ...usageLimits[f.key],
      percentage: (usageLimits[f.key].used / usageLimits[f.key].limit) * 100
    }))
    .filter(f => f.percentage >= 60) // Show warning at 60%
    .sort((a, b) => b.percentage - a.percentage); // Sort by highest usage

  // Don't show anything if no warnings
  if (warnings.length === 0) return null;

  const topWarning = warnings[0];
  const isNearLimit = topWarning.percentage >= 80;
  const isAtLimit = topWarning.remaining === 0;

  return (
    <>
      <div className={`rounded-lg p-3 flex items-center justify-between gap-4 ${
        isAtLimit ? 'bg-red-500 bg-opacity-20 border border-red-500' :
        isNearLimit ? 'bg-yellow-500 bg-opacity-20 border border-yellow-500' :
        'bg-blue-500 bg-opacity-20 border border-blue-500'
      }`}>
        <div className="flex items-center gap-3 flex-1">
          <AlertCircle className={
            isAtLimit ? 'text-red-500' :
            isNearLimit ? 'text-yellow-500' :
            'text-blue-500'
          } size={24} />
          
          <div className="flex-1">
            <div className="text-sm font-semibold">
              {isAtLimit 
                ? `${topWarning.name} limit reached!` 
                : `${topWarning.name}: ${topWarning.remaining}/${topWarning.limit} remaining`
              }
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isAtLimit ? 'bg-red-500' :
                  isNearLimit ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min(topWarning.percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-sm btn-primary"
        >
          <Crown size={16} />
          Upgrade
        </button>
      </div>

      {/* Show all warnings if multiple features approaching limit */}
      {warnings.length > 1 && (
        <div className="text-xs text-gray-400 mt-2">
          Other limits: {warnings.slice(1).map(w => 
            `${w.name} (${w.remaining}/${w.limit})`
          ).join(', ')}
        </div>
      )}

      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default UsageIndicator;