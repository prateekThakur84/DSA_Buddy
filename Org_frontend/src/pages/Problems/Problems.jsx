    import React, { useState, useEffect } from "react";
    import { useDispatch, useSelector } from "react-redux";
    import { motion, AnimatePresence } from "framer-motion";
    import {
      Search,
      Grid,
      List,
      Star,
      CheckCircle,
      AlertCircle,
      Code,
      Trophy,
      Target,
      RefreshCw,
      Zap,
      ChevronDown,
      Hash
    } from "lucide-react";
    import { Link } from "react-router";
    import {
      fetchAllProblems,
      fetchSolvedProblems,
      invalidateCache,
    } from "../../store/slices/problemsSlice";

    const Problems = () => {
      // Redux state
      const dispatch = useDispatch();
      const { problems, solvedProblems, loading, error } = useSelector(
        (state) => state.problems
      );

      // Local UI state
      const [searchTerm, setSearchTerm] = useState("");
      const [selectedDifficulty, setSelectedDifficulty] = useState("all");
      const [selectedTag, setSelectedTag] = useState("all");
      const [viewMode, setViewMode] = useState("grid");

      useEffect(() => {
        dispatch(fetchAllProblems());
        dispatch(fetchSolvedProblems());
      }, [dispatch]);

      const handleRefresh = () => {
        dispatch(invalidateCache());
        dispatch(fetchAllProblems());
        dispatch(fetchSolvedProblems());
      };

      const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDifficulty =
          selectedDifficulty === "all" ||
          problem.difficulty.toLowerCase() === selectedDifficulty;
        const matchesTag = selectedTag === "all" || problem.tags === selectedTag;

        return matchesSearch && matchesDifficulty && matchesTag;
      });

      // Enhanced Color System
      const getDifficultyStyles = (difficulty) => {
        switch (difficulty.toLowerCase()) {
          case "easy":
            return {
              badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              glow: "group-hover:shadow-emerald-500/20",
              border: "group-hover:border-emerald-500/50"
            };
          case "medium":
            return {
              badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
              glow: "group-hover:shadow-amber-500/20",
              border: "group-hover:border-amber-500/50"
            };
          case "hard":
            return {
              badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
              glow: "group-hover:shadow-rose-500/20",
              border: "group-hover:border-rose-500/50"
            };
          default:
            return {
              badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
              glow: "group-hover:shadow-slate-500/20",
              border: "group-hover:border-slate-500/50"
            };
        }
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 },
        },
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      };

      // Loading State
      if (loading && problems.length === 0) {
        return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
              <span className="text-cyan-400 font-mono animate-pulse">Initializing System...</span>
            </div>
          </div>
        );
      }

      // Error State
      if (error) {
        return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center bg-slate-900/50 p-8 rounded-2xl border border-red-500/20 backdrop-blur-md max-w-md w-full">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">System Error</h3>
              <p className="text-slate-400 mb-6">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/20 transition-all"
              >
                Retry Connection
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 ">
          
          {/* 1. Technical Background Pattern */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-cyan-900/10 via-transparent to-transparent opacity-50"></div>
          </div>

          <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
            
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Code className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight mb-1">
                    Problem <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Explorer</span>
                  </h1>
                  <p className="text-slate-400">Master algorithms through practice</p>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-cyan-900/20 border border-slate-700 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-400 rounded-lg transition-all duration-300 backdrop-blur-sm group"
              >
                <RefreshCw className={`w-4 h-4 transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
                <span>Sync Data</span>
              </button>
            </motion.div>

            {/* Stats HUD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            >
              {[
                { 
                  icon: Target, 
                  label: "Total Problems", 
                  value: problems.length, 
                  color: "text-blue-400", 
                  bg: "from-blue-500/10 to-transparent" 
                },
                { 
                  icon: CheckCircle, 
                  label: "Solved", 
                  value: solvedProblems.length, 
                  color: "text-emerald-400", 
                  bg: "from-emerald-500/10 to-transparent" 
                },
                { 
                  icon: Trophy, 
                  label: "Completion", 
                  value: `${problems.length > 0 ? Math.round((solvedProblems.length / problems.length) * 100) : 0}%`, 
                  color: "text-amber-400", 
                  bg: "from-amber-500/10 to-transparent" 
                }
              ].map((stat, i) => (
                <div key={i} className={`relative overflow-hidden bg-slate-900/40 border border-slate-800 rounded-xl p-5 group hover:border-slate-700 transition-all duration-300`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-50`}></div>
                  <div className="relative flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Control Bar (Search & Filter) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-4 z-40 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-2 mb-8 shadow-2xl shadow-black/50"
            >
              <div className="flex flex-col lg:flex-row gap-2">
                
                {/* Search Input */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-transparent focus:border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                  <div className="relative">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer min-w-[140px]"
                    >
                      <option value="all">Difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer min-w-[140px]"
                    >
                      <option value="all">Topic</option>
                      <option value="array">Array</option>
                      <option value="linkedList">Linked List</option>
                      <option value="string">String</option>
                      <option value="graph">Graph</option>
                      <option value="dp">DP</option>
                    </select>
                    <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-1 flex items-center">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-md transition-all ${
                        viewMode === "grid" ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-md transition-all ${
                        viewMode === "list" ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Problems Grid/List */}
            <AnimatePresence mode="wait">
              {filteredProblems.length > 0 ? (
                <motion.div
                  key={viewMode} // Forces re-render on view change for clean animation
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                      : "flex flex-col gap-3"
                  }
                >
                  {filteredProblems.map((problem, index) => {
                    const styles = getDifficultyStyles(problem.difficulty);
                    
                    return (
                      <motion.div
                        key={problem._id}
                        variants={itemVariants}
                        layoutId={problem._id}
                        className="group"
                      >
                        <Link to={`/problem/${problem._id}`} className="block h-full">
                          <div 
                            className={`
                              relative h-full bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden transition-all duration-300
                              ${styles.glow} group-hover:bg-slate-800/40 ${styles.border}
                              ${viewMode === 'list' ? 'flex items-center justify-between p-4' : 'p-6 flex flex-col'}
                            `}
                          >
                            {/* Solved Status Indicator */}
                            {solvedProblems.includes(problem._id) && (
                              <div className="absolute top-0 right-0 p-2">
                                <div className="bg-emerald-500/20 p-1 rounded-bl-xl rounded-tr-xl border-l border-b border-emerald-500/20">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                </div>
                              </div>
                            )}

                            {/* Title Section */}
                            <div className={viewMode === 'list' ? 'flex-1 min-w-0 mr-4' : 'mb-4'}>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                                  {/* Locked Icon (Example) */}
                                  {false && <Star className="w-3 h-3 text-amber-400" />}
                              </div>
                              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors truncate">
                                {problem.title}
                              </h3>
                            </div>

                            {/* Metadata Section */}
                            <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'flex-shrink-0' : 'mt-auto justify-between'}`}>
                              
                              {/* Difficulty Badge */}
                              <span className={`px-2.5 py-0.5 rounded text-xs font-medium border uppercase tracking-wider ${styles.badge}`}>
                                {problem.difficulty}
                              </span>

                              {/* Tags */}
                              {viewMode === 'grid' && (
                                <div className="flex -space-x-2">
                                  {problem.tags?.slice(0, 3).map((tag, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 relative z-[1]" title={tag}>
                                      <Zap className="w-3 h-3" />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {viewMode === 'list' && (
                                <div className="hidden sm:flex items-center gap-2">
                                  {problem.tags?.slice(0, 2).map((tag, i) => (
                                      <span key={i} className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                                        {tag}
                                      </span>
                                  ))}
                                </div>
                              )}
                            </div>

                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-slate-500"
                >
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                    <Search className="w-8 h-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-300">No problems found</h3>
                  <p className="text-sm">Try adjusting your filters or search terms</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      );
    };

    export default Problems;