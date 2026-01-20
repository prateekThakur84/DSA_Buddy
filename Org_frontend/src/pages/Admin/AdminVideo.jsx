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
  Loader2,
  Film
} from "lucide-react";
import { Link } from "react-router";
import axiosClient from "../../utils/axiosClient";

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
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

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 20, stiffness: 100 },
    },
  };

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
      
      const problemsWithVideoStatus = await Promise.all(
        response.data.map(async (problem) => {
          try {
            // Optimizing: Only fetch details if needed, or rely on backend to send video flag in getAllProblem to speed this up
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

  const handleFileSelect = async (e, problemId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingProblemId(problemId);
    setUploadingFile(file);
    setVideoMetadata(null);
    setUploadProgress(0);

    const video = document.createElement("video");
    video.preload = "metadata";
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
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
    };

    video.onerror = () => {
      setError("Invalid video file.");
      setUploadingProblemId(null);
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

      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, upload_url } = signatureResponse.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);
      formData.append("resource_type", "video");

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentCompleted = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percentCompleted);
        }
      });

      const uploadResult = await new Promise((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", upload_url, true);
        xhr.send(formData);
      });

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
      fetchProblems();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload video");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteVideo = async (problemId, problemTitle) => {
    if (!window.confirm(`Delete video for "${problemTitle}"?`)) return;

    try {
      setDeleteLoading(problemId);
      await axiosClient.delete(`/video/delete/${problemId}`);
      setSuccess("Video deleted successfully");
      fetchProblems();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to delete video");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* --- BACKGROUND: CYBER GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B1120] to-[#000000]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[128px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* --- HEADER --- */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 mb-4 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium uppercase tracking-wide">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Film className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Video Solutions
                </h1>
                <p className="text-slate-400 text-lg">Manage educational content and tutorials.</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             {/* Search Bar */}
             <div className="relative group w-full md:w-80">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
               <div className="relative flex items-center bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 group-hover:border-purple-500/30 transition-colors">
                 <Search className="absolute left-3 w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none placeholder:text-slate-600 text-sm"
                 />
               </div>
             </div>
          </motion.div>
        </motion.div>

        {/* --- ALERTS --- */}
        <AnimatePresence>
          {(success || error) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
                success 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              {success ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span className="font-medium">{success || error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN CONTENT --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]"
        >
          {/* Top Sheen */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-6">Problem Title</th>
                  <th className="p-6">Difficulty</th>
                  <th className="p-6">Content Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center">
                       <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                         <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                         <span className="text-sm font-mono animate-pulse">Syncing Library...</span>
                       </div>
                    </td>
                  </tr>
                ) : filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <Video className="w-10 h-10 text-slate-700" />
                        <p>No problems found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((problem) => (
                    <motion.tr 
                      key={problem._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="p-6 font-medium text-slate-200 group-hover:text-white transition-colors">
                        {problem.title}
                      </td>
                      <td className="p-6">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                          problem.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          problem.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="p-6">
                        {problem.hasVideo ? (
                          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium bg-cyan-500/10 px-3 py-1.5 rounded-full w-fit border border-cyan-500/20">
                            <CheckCircle className="w-4 h-4" /> Available
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-500/10 px-3 py-1.5 rounded-full w-fit border border-slate-500/20">
                            <div className="w-2 h-2 rounded-full bg-slate-500" /> Missing
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3">
                          {problem.hasVideo ? (
                            <>
                              <a 
                                href={problem.videoData?.secureUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 rounded-lg transition-all border border-slate-700 hover:border-cyan-500/30"
                                title="Watch Video"
                              >
                                <Play className="w-4 h-4" />
                              </a>
                              <button 
                                onClick={() => handleDeleteVideo(problem._id, problem.title)}
                                disabled={deleteLoading === problem._id}
                                className="p-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 rounded-lg transition-all border border-slate-700 hover:border-rose-500/30 disabled:opacity-50"
                                title="Delete Video"
                              >
                                {deleteLoading === problem._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </>
                          ) : (
                            <div className="relative">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleFileSelect(e, problem._id)}
                                className="hidden"
                                id={`video-upload-${problem._id}`}
                                disabled={uploadLoading}
                              />
                              <label
                                htmlFor={`video-upload-${problem._id}`}
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 transition-all active:scale-95"
                              >
                                <Upload className="w-4 h-4" /> Upload
                              </label>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* --- UPLOAD MODAL --- */}
        <AnimatePresence>
          {uploadingProblemId && videoMetadata && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-[#0B1120] border border-purple-500/30 rounded-2xl w-full max-w-lg shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] relative overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Cloud className="w-6 h-6 text-purple-400" />
                    Upload Solution
                  </h3>
                  {!uploadLoading && (
                    <button 
                      onClick={() => { setUploadingProblemId(null); setVideoMetadata(null); }}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* File Info Card */}
                  <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <FileVideo className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-200 truncate">{videoMetadata.fileName}</p>
                        <p className="text-xs text-slate-500">{videoMetadata.type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 p-2 rounded-lg">
                        <HardDrive className="w-3.5 h-3.5" /> {videoMetadata.fileSize} MB
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/20 p-2 rounded-lg">
                        <Clock className="w-3.5 h-3.5" /> {videoMetadata.duration}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (Only when uploading) */}
                  {uploadLoading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase text-purple-400 tracking-wider">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setUploadingProblemId(null); setVideoMetadata(null); }}
                      disabled={uploadLoading}
                      className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleVideoUpload(uploadingProblemId, uploadingFile)}
                      disabled={uploadLoading}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {uploadLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing</>
                      ) : (
                        "Confirm Upload"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminVideo;