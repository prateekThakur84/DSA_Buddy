const User = require('../models/user.model');

/**
 * Generic function to create feature-specific middleware
 * @param {string} featureName - Name of the feature in usageLimits (e.g., 'codeExecutions')
 * @param {string} featureDisplayName - Human-readable name for error messages
 * @returns {Function} Express middleware function
 */
const checkFeatureLimit = (featureName, featureDisplayName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      console.log(`checking limit for ${featureName}`);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Premium users have unlimited access - bypass all checks
      if (user.isPremiumActive()) {
        req.isPremiumUser = true;
        return next();
      }

      // Check if free tier limit reached
      const usage = user.usageLimits[featureName];

      if (!usage) {
        return res.status(500).json({
          success: false,
          message: 'Invalid feature configuration'
        });
      }

      // Block if limit reached
      if (usage.used >= usage.limit) {
        return res.status(403).json({
          success: false,
          limitReached: true,
          featureName: featureDisplayName,
          message: `You've reached your free tier limit for ${featureDisplayName}. Upgrade to Premium for unlimited access!`,
          usage: {
            used: usage.used,
            limit: usage.limit,
            remaining: 0
          },
          upgradeUrl: '/pricing'
        });
      }

      // Warning when approaching limit (80% threshold)
      const warningThreshold = Math.floor(usage.limit * 0.8);
      if (usage.used >= warningThreshold && usage.used < usage.limit) {
        req.usageWarning = {
          message: `You're approaching your ${featureDisplayName} limit`,
          remaining: usage.limit - usage.used
        };
      }

      req.isPremiumUser = false;
      next();
    } catch (error) {
      console.error('Usage check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking usage limits'
      });
    }
  };
};

/**
 * Utility function to increment usage (use inside controllers)
 * @param {string} userId - User ID
 * @param {string} featureName - Name of the feature in usageLimits
 * @returns {Promise<void>}
 */
const incrementFeatureUsageUtil = async (userId, featureName) => {
  try {
    console.log(`increment by 1 for ${featureName}`);
    
    await User.findByIdAndUpdate(
      userId,
      { $inc: { [`usageLimits.${featureName}.used`]: 1 } },
      { new: true }
    );
  } catch (error) {
    console.error('Usage increment error:', error);
    // Don't throw - just log the error
  }
};

// Create specific middleware for each feature
const checkCodeExecutionLimit = checkFeatureLimit('codeExecutions', 'Code Executions');
const checkAIChatLimit = checkFeatureLimit('aiChatQueries', 'AI Chat Queries');
const checkVideoSolutionLimit = checkFeatureLimit('videoSolutionViews', 'Video Solutions');
const checkEditorialLimit = checkFeatureLimit('editorialAccess', 'Editorial Content');

/**
 * Middleware to attach usage info to every response (optional)
 */
const attachUsageInfo = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next();

    const user = await User.findById(userId)
      .select('subscriptionTier usageLimits subscriptionEndDate');

    if (user && !user.isPremiumActive()) {
      res.locals.usageInfo = {
        codeExecutions: {
          used: user.usageLimits.codeExecutions.used,
          limit: user.usageLimits.codeExecutions.limit,
          remaining: user.usageLimits.codeExecutions.limit - user.usageLimits.codeExecutions.used
        },
        aiChatQueries: {
          used: user.usageLimits.aiChatQueries.used,
          limit: user.usageLimits.aiChatQueries.limit,
          remaining: user.usageLimits.aiChatQueries.limit - user.usageLimits.aiChatQueries.used
        },
        videoSolutionViews: {
          used: user.usageLimits.videoSolutionViews.used,
          limit: user.usageLimits.videoSolutionViews.limit,
          remaining: user.usageLimits.videoSolutionViews.limit - user.usageLimits.videoSolutionViews.used
        },
        editorialAccess: {
          used: user.usageLimits.editorialAccess.used,
          limit: user.usageLimits.editorialAccess.limit,
          remaining: user.usageLimits.editorialAccess.limit - user.usageLimits.editorialAccess.used
        }
      };
    }

    next();
  } catch (error) {
    console.error('Attach usage info error:', error);
    next();
  }
};

module.exports = {
  checkCodeExecutionLimit,
  checkAIChatLimit,
  checkVideoSolutionLimit,
  checkEditorialLimit,
  incrementFeatureUsageUtil,
  attachUsageInfo
};
