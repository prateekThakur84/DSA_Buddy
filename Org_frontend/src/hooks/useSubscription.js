import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionStatus } from '../store/slices/subscriptionSlice';

export const useSubscription = () => {
  const dispatch = useDispatch();
  const { 
    currentSubscription, 
    usageLimits, 
    isPremium,
    loading 
  } = useSelector((state) => state.subscription);
  
  useEffect(() => {
    dispatch(getSubscriptionStatus());
  }, [dispatch]);
  
  const hasLimitReached = (featureName) => {
    if (isPremium) return false;
    if (!usageLimits || !usageLimits[featureName]) return false;
    return usageLimits[featureName].remaining <= 0;
  };
  
  const getRemaining = (featureName) => {
    if (isPremium) return 'Unlimited';
    if (!usageLimits || !usageLimits[featureName]) return 0;
    return usageLimits[featureName].remaining;
  };
  
  const getUsagePercentage = (featureName) => {
    if (isPremium) return 0;
    if (!usageLimits || !usageLimits[featureName]) return 0;
    return usageLimits[featureName].percentage || 0;
  };
  
  return { 
    currentSubscription, 
    usageLimits, 
    isPremium,
    loading,
    hasLimitReached,
    getRemaining,
    getUsagePercentage
  };
};