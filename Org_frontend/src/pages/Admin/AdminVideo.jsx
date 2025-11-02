import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Video,
  AlertTriangle,
  CheckCircle,
  Search,
  Play,
  Trash2,
  ArrowLeft,
  Cloud,
  FileVideo,
  X,
  FileText,
  Clock,
  HardDrive,
} from "lucide-react";
import { Link } from "react-router";
import axiosClient from "../../utils/axiosClient";

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Video upload modal state
  const [uploadingProblemId, setUploadingProblemId] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    setFilteredProblems(
      problems.filter((problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [problems, searchTerm]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/problem/getAllProblem");
      // Fetch detailed problem info to check for videos
      const problemsWithVideoStatus = await Promise.all(
        response.data.map(async (problem) => {
          try {
            const detailResponse = await axiosClient.get(
              `/problem/problemById/${problem._id}`
            );
            return {
              ...problem,
              hasVideo: !!detailResponse.data.secureUrl,
              videoData: detailResponse.data.secureUrl
                ? {
                    secureUrl: detailResponse.data.secureUrl,
                    thumbnailUrl: detailResponse.data.thumbnailUrl,
                    duration: detailResponse.data.duration,
                  }
                : null,
            };
          } catch (error) {
            return { ...problem, hasVideo: false, videoData: null };
          }
        })
      );
      setProblems(problemsWithVideoStatus);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection and extract metadata
  const handleFileSelect = async (e, problemId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingProblemId(problemId);
    setUploadingFile(file);
    setVideoMetadata(null);
    setUploadProgress(0);

    // Extract video metadata
    const video = document.createElement("video");
    video.onloadedmetadata = () => {
      const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
      const duration = Math.floor(video.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      setVideoMetadata({
        fileName: file.name,
        fileSize: sizeInMB,
        duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        type: file.type,
      });

      // Cleanup
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      setError("Failed to read video file. Please select a valid video.");
      setUploadingProblemId(null);
      setUploadingFile(null);
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  };

  const handleVideoUpload = async (problemId, file) => {
    if (!file) return;

    try {
      setUploadLoading(true);
      setError("");
      setSuccess("");
      setUploadProgress(0);

      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const {
        signature,
        timestamp,
        public_id,
        api_key,
        cloud_name,
        upload_url,
      } = signatureResponse.data;

      // Step 2: Upload to Cloudinary with progress tracking
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);
      formData.append("resource_type", "video");

      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentCompleted = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percentCompleted);
        }
      });

      // Handle completion
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            try {
              const uploadResult = JSON.parse(xhr.responseText);
              resolve(uploadResult);
            } catch (err) {
              reject(new Error("Failed to parse upload response"));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });
      });

      xhr.open("POST", upload_url, true);
      xhr.send(formData);

      const uploadResult = await uploadPromise;

      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      // Step 3: Save video metadata to backend
      await axiosClient.post("/video/save", {
        problemId,
        cloudinaryPublicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        duration: uploadResult.duration,
      });

      setSuccess("Video uploaded successfully!");
      setUploadingProblemId(null);
      setUploadingFile(null);
      setVideoMetadata(null);
      setUploadProgress(0);

      fetchProblems(); // Refresh the list

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error uploading video:", error);
      setError(
        error.response?.data?.error || error.message || "Failed to upload video"
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteVideo = async (problemId, problemTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the video for "${problemTitle}"?`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(problemId);
      await axiosClient.delete(`/video/delete/${problemId}`);

      setSuccess("Video deleted successfully");
      fetchProblems(); // Refresh the list

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting video:", error);
      setError(error.response?.data?.error || "Failed to delete video");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-cyan-400 font-medium">
                Loading problems...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Video Solutions
                </h1>
                <p className="text-gray-300">
                  Upload and manage video solutions for problems
                </p>
              </div>
            </div>
            <Link
              to="/admin"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin</span>
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Modal */}
        <AnimatePresence>
          {uploadingProblemId && videoMetadata && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                if (!uploadLoading) {
                  setUploadingProblemId(null);
                  setVideoMetadata(null);
                  setUploadingFile(null);
                  setUploadProgress(0);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-900 via-gray-900 to-black border border-cyan-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    if (!uploadLoading) {
                      setUploadingProblemId(null);
                      setVideoMetadata(null);
                      setUploadingFile(null);
                      setUploadProgress(0);
                    }
                  }}
                  disabled={uploadLoading}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>

                {!uploadLoading ? (
                  <>
                    {/* Video Info Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-8"
                    >
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <Video className="w-5 h-5 text-cyan-400" />
                        <span>Video Information</span>
                      </h3>

                      <div className="space-y-3 mb-6">
                        {/* File Name */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-start space-x-3 bg-black/30 border border-cyan-400/20 rounded-lg p-3"
                        >
                          <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                              File Name
                            </p>
                            <p className="text-sm text-white font-medium truncate">
                              {videoMetadata.fileName}
                            </p>
                          </div>
                        </motion.div>

                        {/* File Size */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-start space-x-3 bg-black/30 border border-cyan-400/20 rounded-lg p-3"
                        >
                          <HardDrive className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                              File Size
                            </p>
                            <p className="text-sm text-white font-medium">
                              {videoMetadata.fileSize} MB
                            </p>
                          </div>
                        </motion.div>

                        {/* Duration */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-start space-x-3 bg-black/30 border border-cyan-400/20 rounded-lg p-3"
                        >
                          <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                              Duration
                            </p>
                            <p className="text-sm text-white font-medium">
                              {videoMetadata.duration}
                            </p>
                          </div>
                        </motion.div>

                        {/* File Type */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-start space-x-3 bg-black/30 border border-cyan-400/20 rounded-lg p-3"
                        >
                          <FileVideo className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                              File Type
                            </p>
                            <p className="text-sm text-white font-medium">
                              {videoMetadata.type || "video file"}
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-cyan-400/10">
                        <button
                          onClick={() => {
                            setUploadingProblemId(null);
                            setVideoMetadata(null);
                            setUploadingFile(null);
                            setUploadProgress(0);
                          }}
                          className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            handleVideoUpload(uploadingProblemId, uploadingFile)
                          }
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-colors font-medium"
                        >
                          Confirm Upload
                        </button>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Upload Progress Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                          <Cloud className="w-5 h-5 text-cyan-400 animate-pulse" />
                          <span>Uploading Video</span>
                        </h3>
                        <p className="text-sm text-gray-400">
                          {videoMetadata.fileName}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-3">
                        <div className="relative h-3 bg-black/50 rounded-full overflow-hidden border border-cyan-400/20">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
                          />
                        </div>

                        {/* Progress Percentage */}
                        <div className="flex justify-between items-center">
                          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                            {uploadProgress}%
                          </span>
                          <span className="text-xs text-gray-400 uppercase tracking-wide">
                            {uploadProgress === 100 ? "Processing..." : "In Progress"}
                          </span>
                        </div>
                      </div>

                      {/* Upload Animation */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex justify-center"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-400/30">
                          <Cloud className="w-8 h-8 text-cyan-400" />
                        </div>
                      </motion.div>

                      {/* File Stats During Upload */}
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-cyan-400/10">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Size</p>
                          <p className="text-sm font-semibold text-cyan-400">
                            {videoMetadata.fileSize} MB
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Duration</p>
                          <p className="text-sm font-semibold text-blue-400">
                            {videoMetadata.duration}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Status</p>
                          <motion.p
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-sm font-semibold text-green-400"
                          >
                            Active
                          </motion.p>
                        </div>
                      </div>

                      {/* Uploading Animation Indicator */}
                      <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-center text-sm text-gray-400"
                      >
                        Please don't close this window...
                      </motion.p>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problems List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl overflow-hidden"
        >
          {filteredProblems.length === 0 ? (
            <div className="text-center py-16">
              <FileVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No problems found
              </h3>
              <p className="text-gray-400">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No problems have been created yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Video Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {filteredProblems.map((problem, index) => (
                    <motion.tr
                      key={problem._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-black/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">
                          {problem.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {problem.hasVideo ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">
                              Video Available
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm">
                              No Video
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {problem.hasVideo ? (
                          <>
                            <a
                              href={problem.videoData?.secureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Watch
                            </a>
                            <button
                              onClick={() =>
                                handleDeleteVideo(problem._id, problem.title)
                              }
                              disabled={deleteLoading === problem._id}
                              className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
                            >
                              {deleteLoading === problem._id ? (
                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                              ) : (
                                <Trash2 className="w-3 h-3 mr-1" />
                              )}
                              {deleteLoading === problem._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                handleFileSelect(e, problem._id)
                              }
                              disabled={uploadLoading}
                              className="hidden"
                              id={`video-upload-${problem._id}`}
                            />
                            <label
                              htmlFor={`video-upload-${problem._id}`}
                              className={`inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 ${
                                uploadLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              } text-white text-sm rounded transition-colors`}
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Upload Video
                            </label>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminVideo;