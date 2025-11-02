const { incrementFeatureUsageUtil } = require("../middleware/usage.middleware");
const { checkFeatureLimit } = require("../middleware/usage.middleware");

/**
 * Track video solution view
 */
const trackVideoView = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;

    // Check if user is premium
    if (req.isPremiumUser) {
      return res.status(200).json({
        success: true,
        message: "Premium user - unlimited access",
      });
    }

    // Check if user has remaining views
    const User = require("../models/user.model");
    const user = await User.findById(userId);

    const videoUsage = user.usageLimits.videoSolutionViews;

    if (videoUsage.used >= videoUsage.limit) {
      return res.status(403).json({
        success: false,
        limitReached: true,
        message: "Video view limit reached",
        usage: {
          used: videoUsage.used,
          limit: videoUsage.limit,
        },
      });
    }

    // Increment usage
    await incrementFeatureUsageUtil(userId, "videoSolutionViews");

    res.status(200).json({
      success: true,
      message: "Video view tracked",
      remaining: videoUsage.limit - (videoUsage.used + 1),
    });
  } catch (err) {
    console.error("Track video view error:", err);
    res.status(500).json({
      success: false,
      message: "Error tracking video view",
    });
  }
};

/**
 * Track editorial access
 */
const trackEditorialAccess = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;

    // Check if user is premium
    if (req.isPremiumUser) {
      return res.status(200).json({
        success: true,
        message: "Premium user - unlimited access",
      });
    }

    // Check if user has remaining editorial accesses
    const User = require("../models/user.model");
    const user = await User.findById(userId);

    const editorialUsage = user.usageLimits.editorialAccess;

    if (editorialUsage.used >= editorialUsage.limit) {
      return res.status(403).json({
        success: false,
        limitReached: true,
        message: "Editorial access limit reached",
        usage: {
          used: editorialUsage.used,
          limit: editorialUsage.limit,
        },
      });
    }

    // Increment usage
    await incrementFeatureUsageUtil(userId, "editorialAccess");

    res.status(200).json({
      success: true,
      message: "Editorial access tracked",
      remaining: editorialUsage.limit - (editorialUsage.used + 1),
    });
  } catch (err) {
    console.error("Track editorial access error:", err);
    res.status(500).json({
      success: false,
      message: "Error tracking editorial access",
    });
  }
};

module.exports = { trackVideoView, trackEditorialAccess };
