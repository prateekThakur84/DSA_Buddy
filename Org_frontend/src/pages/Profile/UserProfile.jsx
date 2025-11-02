import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { 
  User, 
  Mail, 
  Trophy, 
  CheckCircle, 
  Clock, 
  Code, 
  BarChart3,
  Edit,
  Settings,
  Star,
  Calendar,
  Target
} from 'lucide-react';
import { Link } from 'react-router';
import axiosClient from '../../utils/axiosClient';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    recentSubmissions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      // Fetch solved problems
      const solvedResponse = await axiosClient.get('/problem/problemSolvedByUser');
      setSolvedProblems(solvedResponse.data);
      
      // Calculate stats
      const difficultyStats = solvedResponse.data.reduce((acc, problem) => {
        acc[problem.difficulty.toLowerCase()]++;
        return acc;
      }, { easy: 0, medium: 0, hard: 0 });
      
      setStats({
        totalSolved: solvedResponse.data.length,
        ...difficultyStats,
        recentSubmissions: [] // We could fetch recent submissions here if needed
      });
      
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getInitials = () => {
  if (user?.firstName && user?.lastName) {
    // Take first letter of first and last name
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  } 
  if (user?.firstName) {
    // If only firstName exists, take first two letters (or first letter if only 1)
    return user.firstName.slice(0, 2).toUpperCase();
  } 
  if (user?.email) {
    // Extract initials from email before @
    const emailName = user.email.split('@')[0]; // "john.doe"
    const parts = emailName.split(/[\._\-]/); // split by dot, underscore, hyphen
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase(); // JD
    }
    return emailName.slice(0, 2).toUpperCase(); // fallback, first two letters
  }
  return 'U';
};


  

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-cyan-400 font-medium">Loading profile...</span>
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
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400/30"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-cyan-400/30">
                  <span className="text-2xl font-bold text-white">
                    {getInitials()}
                  </span>
                </div>
              )}
              {user?.role === 'admin' && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-1">
                  <Star className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || 'User'
                  }
                </h1>
                {user?.role === 'admin' && (
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-sm text-white rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-gray-300 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(user?.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Link
                to="/profile/edit"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-2 px-4 py-2 bg-black/30 border border-cyan-400/20 hover:bg-black/50 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">{stats.totalSolved}</span>
            </div>
            <p className="text-gray-300 font-medium">Total Solved</p>
          </div>

          <div className="bg-black/20 backdrop-blur-lg border border-green-400/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{stats.easy}</span>
            </div>
            <p className="text-gray-300 font-medium">Easy</p>
          </div>

          <div className="bg-black/20 backdrop-blur-lg border border-yellow-400/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{stats.medium}</span>
            </div>
            <p className="text-gray-300 font-medium">Medium</p>
          </div>

          <div className="bg-black/20 backdrop-blur-lg border border-red-400/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-red-400" />
              <span className="text-2xl font-bold text-white">{stats.hard}</span>
            </div>
            <p className="text-gray-300 font-medium">Hard</p>
          </div>
        </motion.div>

        {/* Solved Problems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-cyan-400/10">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-cyan-400" />
              Solved Problems ({solvedProblems.length})
            </h2>
          </div>

          {solvedProblems.length === 0 ? (
            <div className="text-center py-16">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No problems solved yet</h3>
              <p className="text-gray-400 mb-4">Start solving problems to see them here</p>
              <Link
                to="/problems"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
              >
                <Target className="w-4 h-4" />
                <span>Explore Problems</span>
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {solvedProblems.map((problem, index) => (
                  <motion.div
                    key={problem._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/problem/${problem._id}`}>
                      <div className="bg-black/30 border border-gray-700/30 rounded-lg p-4 hover:bg-black/50 hover:border-cyan-400/30 transition-all duration-200">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-medium group-hover:text-cyan-100 transition-colors text-sm">
                            {problem.title}
                          </h3>
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <span className="inline-block px-2 py-1 bg-cyan-400/10 text-cyan-300 text-xs rounded-full border border-cyan-400/20">
                            {problem.tags}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;