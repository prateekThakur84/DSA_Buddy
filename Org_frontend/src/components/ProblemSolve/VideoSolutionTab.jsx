import React, { useState, useRef } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { Crown, Lock, Play, Zap, AlertCircle } from "lucide-react"; // Added AlertCircle
import { useSubscription } from "../../hooks/useSubscription";
import PaywallModal from "../common/PayWallModal";
import axiosInstance from "../../utils/axiosClient";

const VideoSolutionTab = ({ problem }) => {
  const { isPremium, usageLimits, hasLimitReached } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [videoUnlocked, setVideoUnlocked] = useState(false);
  const [trackingError, setTrackingError] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const playerRef = useRef(null);

  if (!problem?.secureUrl) {
    return (
      <div className="text-center p-8 text-slate-400 bg-gray-800 rounded-lg border border-cyan-500/20">
        <Play size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-semibold mb-2">Video Solution Coming Soon</p>
        <p className="text-sm">
          Our team is working on creating video solutions for this problem
        </p>
      </div>
    );
  }

  // Check if limit is reached
  const videoLimitReached = !isPremium && hasLimitReached("videoSolutionViews");

  const handleUnlockVideo = async () => {
    // Double check limit before calling API
    if (videoLimitReached) {
        setShowPaywall(true);
        return;
    }

    try {
      setUnlocking(true);
      const response = await axiosInstance.post(
        `/api/usage/track/video/${problem._id}`
      );
      if (response.data.success) {
        setVideoUnlocked(true);
        setTrackingError(null);
      }
    } catch (error) {
      setTrackingError(
        error.response?.data?.message || "Error unlocking video"
      );
    } finally {
      setUnlocking(false);
    }
  };

  const plyrProps = {
    source: {
      type: "video",
      title: problem.title,
      sources: [
        {
          src: problem.secureUrl,
          type: "video/mp4",
        },
      ],
      poster: problem.thumbnailUrl,
    },
    options: {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "volume",
        "settings",
        "pip",
        "fullscreen",
      ],
      ratio: "16:9",
      tooltips: { controls: true },
    },
  };

  // --- ❌ DELETED THE EARLY RETURN BLOCK THAT CAUSED THE ISSUE ---

  return (
    <div className="relative space-y-3">
      {/* Premium Badge */}
      {isPremium ? (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="text-cyan-400" size={18} />
            <span className="text-xs font-medium text-white">
              Premium Member - Unlimited Access
            </span>
          </div>
        </div>
      ) : usageLimits?.videoSolutionViews ? (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-xs font-medium text-white">
                Credits Remaining:{" "}
                <span className={`${videoLimitReached ? "text-red-400" : "text-cyan-400"} font-bold`}>
                  {usageLimits.videoSolutionViews.remaining}
                </span>{" "}
                / {usageLimits.videoSolutionViews.limit}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {trackingError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs">
          ❌ {trackingError}
        </div>
      )}

      {/* Video Player Container */}
      <div
        className="relative w-full rounded-lg overflow-hidden shadow-xl border border-slate-700 bg-slate-900"
        ref={playerRef}
      >
        {(videoUnlocked || isPremium) && <Plyr {...plyrProps} />}
        {!videoUnlocked && !isPremium && (
          <div
            className="w-full aspect-video bg-cover bg-center filter blur-sm opacity-40"
            style={{
              backgroundImage: problem.thumbnailUrl
                ? `url(${problem.thumbnailUrl})`
                : "linear-gradient(135deg, #06b6d4 0%, #0369a1 100%)",
            }}
          />
        )}
      </div>

      {/* Video Info */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-1">
          Video Solution
        </h3>
        <p className="text-slate-400 text-xs">
          Watch this detailed video explanation for{" "}
          <span className="text-cyan-400 font-medium">{problem.title}</span>.
        </p>
      </div>

      {/* ✅ UPDATED LOCK OVERLAY TO HANDLE LIMIT REACHED */}
      {!videoUnlocked && !isPremium && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-40 rounded-lg p-6">
          <div className="text-center max-w-xs px-4">
            
            {/* Header Icon */}
            <div className="bg-cyan-500/20 p-4 rounded-full border border-cyan-500/40 w-fit mx-auto mb-4">
              {videoLimitReached ? (
                <AlertCircle className="text-red-400" size={40} />
              ) : (
                <Lock className="text-cyan-400" size={40} />
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2">
              {videoLimitReached ? "Daily Limit Reached" : "Video Solution Locked"}
            </h3>

            {/* Description */}
            <p className="text-slate-300 text-xs mb-4">
              {videoLimitReached 
                ? "You have used all your free video unlocks for today. Upgrade to Premium for unlimited access." 
                : "Unlock this video solution to watch the detailed explanation and approach for this problem."}
            </p>

            {/* Credit Info Box */}
            <div className={`rounded-lg p-3 mb-4 border ${videoLimitReached ? "bg-red-500/10 border-red-500/30" : "bg-slate-800/50 border-slate-700"}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className={videoLimitReached ? "text-red-400" : "text-cyan-400"} size={16} />
                <span className="text-xs font-semibold text-white">
                  {videoLimitReached ? "0 Credits Available" : "1 Credit Required"}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                You have{" "}
                <span className={`${videoLimitReached ? "text-red-400" : "text-cyan-400"} font-bold`}>
                  {usageLimits?.videoSolutionViews?.remaining || 0}
                </span>{" "}
                credits available
              </div>
            </div>

            {/* Buttons */}
            {!videoLimitReached && (
                <button
                onClick={handleUnlockVideo}
                disabled={unlocking}
                className={`w-full py-2 px-4 rounded-md text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 mb-2 ${
                    unlocking
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/20"
                }`}
                >
                {unlocking ? (
                    <>
                    <div className="animate-spin">⚙️</div> Unlocking...
                    </>
                ) : (
                    <>
                    <Zap size={16} /> Unlock with 1 Credit
                    </>
                )}
                </button>
            )}

            <button
              onClick={() => setShowPaywall(true)}
              className={`w-full py-2 px-4 rounded-md text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                  videoLimitReached 
                  ? "bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600" 
                  : "text-cyan-400 border-cyan-500/50 hover:border-cyan-400/80 hover:bg-cyan-400/10"
              }`}
            >
              <Crown size={16} />
              {videoLimitReached ? "Upgrade to Unlock Now" : "Upgrade to Premium"}
            </button>
          </div>
        </div>
      )}

      {/* Paywall Modal is kept at the end */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Video Solutions"
        usage={usageLimits?.videoSolutionViews}
      />
    </div>
  );
};

export default VideoSolutionTab;