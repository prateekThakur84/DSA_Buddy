import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Code,
  Trophy,
  Target,
  RefreshCw,
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

  console.log(problems);
  

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Fetch data on mount - will use cache if available
  useEffect(() => {
    dispatch(fetchAllProblems());
    dispatch(fetchSolvedProblems());
  }, [dispatch]);

  // Manual refresh function
  const handleRefresh = () => {
    dispatch(invalidateCache());
    dispatch(fetchAllProblems());
    dispatch(fetchSolvedProblems());
  };

  // Filter problems based on search and filters
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
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

  const isLocked = (problemId) => {
    return false;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading && problems.length === 0) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-300 mb-2">
                Error loading problems
              </h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Problems</h1>
                <p className="text-gray-300">
                  Practice coding problems and improve your skills
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-cyan-400 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              title="Refresh problems"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {problems.length}
                  </p>
                  <p className="text-gray-400 text-sm">Total Problems</p>
                </div>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-lg border border-green-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {solvedProblems.length}
                  </p>
                  <p className="text-gray-400 text-sm">Solved</p>
                </div>
              </div>
            </div>
            <div className="bg-black/20 backdrop-blur-lg border border-yellow-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {problems.length > 0
                      ? Math.round(
                          (solvedProblems.length / problems.length) * 100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex gap-4 items-center">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Tags</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="string">String</option>
                <option value="graph">Graph</option>
                <option value="dp">Dynamic Programming</option>
              </select>

              <div className="flex bg-black/30 border border-cyan-400/20 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-cyan-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-cyan-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Problems List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem._id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group"
            >
              <Link to={`/problem/${problem._id}`}>
                <div className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6 hover:bg-black/30 hover:border-cyan-400/30 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-100 transition-colors">
                        {index + 1}. {problem.title}
                      </h3>
                      {solvedProblems.includes(problem._id) && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    {isLocked(problem._id) && (
                      <div className="text-yellow-400">
                        <Star className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-cyan-400/10 text-cyan-300 text-xs rounded-full border border-cyan-400/20">
                      {problem.tags}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No problems found
            </h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Problems;
