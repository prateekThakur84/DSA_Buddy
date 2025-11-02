import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../../utils/axiosClient";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { CloudUpload, CheckCircle, AlertTriangle } from "lucide-react";

function AdminUpload() {
  const { problemId } = useParams();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [error, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();

  const selectedFile = watch("videoFile")?.[0];

  // Smooth progress animation
  const progressMotion = useMotionValue(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const controls = animate(progressMotion, uploadProgress, {
      duration: 0.3,
      onUpdate: (latest) => setDisplayProgress(Math.round(latest)),
    });
    return () => controls.stop();
  }, [uploadProgress]);

  const onSubmit = async (data) => {
    const file = data.videoFile[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();
    setUploadedVideo(null);
    setErrorMsg("");

    try {
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const {
        signature,
        timestamp,
        public_id,
        api_key,
        upload_url,
      } = signatureResponse.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      const metadataResponse = await axiosClient.post("/video/save", {
        problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-black/40 border border-cyan-400/20 rounded-2xl p-8 backdrop-blur-md shadow-2xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <CloudUpload className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Upload Video Solution</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Choose video file
            </label>
            <input
              type="file"
              accept="video/*"
              {...register("videoFile", {
                required: "Please select a video file",
                validate: {
                  isVideo: (files) =>
                    files?.[0]?.type.startsWith("video/") ||
                    "Please select a valid video file",
                  fileSize: (files) => {
                    const file = files?.[0];
                    const maxSize = 100 * 1024 * 1024;
                    return (
                      file.size <= maxSize ||
                      "File size must be less than 100MB"
                    );
                  },
                },
              })}
              className="file-input file-input-bordered w-full file-input-accent"
              disabled={uploading}
            />
            {errors.videoFile && (
              <p className="text-red-400 text-sm mt-2">{errors.videoFile.message}</p>
            )}
          </div>

          {/* File Info */}
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cyan-500/10 border border-cyan-400/20 rounded-lg p-4 text-cyan-300"
            >
              <p className="font-semibold">{selectedFile.name}</p>
              <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
            </motion.div>
          )}

          {/* Upload Progress Animated */}
          <AnimatePresence>
            {uploading && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-cyan-400/30"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-cyan-400 font-semibold">Uploading...</span>
                  <span className="text-white font-semibold">{displayProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 relative"
                  >
                    {/* shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
                  </motion.div>
                </div>
                <style>{`
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}</style>
                <p className="text-xs text-gray-400 mt-2 italic">
                  Please wait while your video is being uploaded...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success */}
          {uploadedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 flex items-start space-x-2"
            >
              <CheckCircle className="w-5 h-5 mt-1" />
              <div>
                <h3 className="font-semibold">Upload Successful!</h3>
                <p className="text-sm">
                  Duration: {formatDuration(uploadedVideo.duration)}
                </p>
                <p className="text-sm">
                  Uploaded:{" "}
                  {new Date(uploadedVideo.uploadedAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-300 
                ${uploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                }`}
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminUpload;
