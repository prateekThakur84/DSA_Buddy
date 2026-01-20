import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { 
  User, Calendar, MapPin, Edit, Crown, 
  Zap, Terminal, MessageSquare, PlayCircle, 
  Code, CheckCircle, TrendingUp, Layers, 
  ArrowRight, Activity, Hash, CreditCard
} from 'lucide-react';

import { fetchAllProblems } from '../../store/slices/problemsSlice';
import axiosClient from '../../utils/axiosClient';

// --- Constants ---
const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const formatDate = (dateString) => {
  return dateString 
    ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
    : 'N/A';
};

// --- Sub-Components (Themed) ---

const UsageGauge = ({ value, max, icon: Icon, color, label }) => {
  const percentage = Math.min(100, (value / (max || 1)) * 100);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Background Track */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle cx="24" cy="24" r={radius} stroke="#1e293b" strokeWidth="3" fill="transparent" />
          <circle
            cx="24" cy="24" r={radius}
            stroke={color} strokeWidth="3" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <Icon className="absolute w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
      </div>
      <div>
        <div className="text-sm font-bold text-white">
          {value} <span className="text-slate-500 font-normal">/ {max}</span>
        </div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</div>
      </div>
    </div>
  );
};

const StatCard = ({ label, solved, total, color }) => {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  
  // High-contrast neon colors for the Cyber theme
  const colorMap = {
    emerald: { text: 'text-green-400', bg: 'bg-green-500', glow: 'shadow-green-500/20' },
    amber: { text: 'text-yellow-400', bg: 'bg-yellow-500', glow: 'shadow-yellow-500/20' },
    rose: { text: 'text-red-400', bg: 'bg-red-500', glow: 'shadow-red-500/20' },
  };
  
  const theme = colorMap[color] || colorMap.emerald;

  return (
    <div className={`p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg ${theme.glow}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}>{label}</span>
        <span className="text-xs text-slate-500 font-mono">{percentage.toFixed(1)}%</span>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-white">{solved}</span>
        <span className="text-xs text-slate-500">/ {total}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full ${theme.bg} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
};

// --- Main Component ---
const UserProfile = () => {
  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector((state) => state.auth);
  const { problems: allProblems } = useSelector((state) => state.problems);

  const [currentUser, setCurrentUser] = useState(reduxUser);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_AVATAR;
  };

  useEffect(() => {
    if (reduxUser) {
      const fetchData = async () => {
        try {
          setLoading(true);
          dispatch(fetchAllProblems());
          const [profileRes, solvedRes] = await Promise.all([
            axiosClient.get('/auth/profile'),
            axiosClient.get('/problem/problemSolvedByUser')
          ]);
          setCurrentUser(profileRes.data.user);
          setSolvedProblems(solvedRes.data);
        } catch (error) {
          console.error("Profile sync error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [reduxUser, dispatch]);

  const stats = useMemo(() => {
    const totals = { easy: 0, medium: 0, hard: 0, all: allProblems.length };
    allProblems.forEach(p => {
      const diff = p.difficulty?.toLowerCase() || 'easy';
      if (totals[diff] !== undefined) totals[diff]++;
    });

    const solved = { easy: 0, medium: 0, hard: 0, all: solvedProblems.length, topics: {} };
    solvedProblems.forEach(p => {
      const diff = p.difficulty?.toLowerCase() || 'easy';
      if (solved[diff] !== undefined) solved[diff]++;
      p.tags?.forEach(tag => { solved.topics[tag] = (solved.topics[tag] || 0) + 1; });
    });

    return { totals, solved };
  }, [allProblems, solvedProblems]);

  const topTopics = Object.entries(stats.solved.topics)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  const displayUser = currentUser || reduxUser;

  // Donut Chart Calculation
  const totalSolved = stats.solved.all;
  const easyDeg = (stats.solved.easy / totalSolved) * 360 || 0;
  const mediumDeg = (stats.solved.medium / totalSolved) * 360 || 0;

  if (loading && !displayUser) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Syncing Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 relative">
      
      {/* --- BACKGROUND: CYBER GRID (Matched to AboutPage) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B1120] to-[#000000]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 pt-28 pb-12 relative z-10 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Command Center</h1>
            <p className="text-slate-400">Manage your identity and track your coding metrics.</p>
          </div>
          <Link 
            to="/profile/edit" 
            className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-700 text-white font-semibold rounded-xl hover:border-cyan-500/50 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] transition-all"
          >
            <Edit className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
            Edit Profile
          </Link>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Identity (4 Cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Gradient Banner */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
            
            <div className="relative mt-8 mb-4">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]">
                <img
                  src={displayUser?.profilePicture || DEFAULT_AVATAR}
                  alt="Avatar"
                  onError={handleImageError}
                  className="w-full h-full rounded-full object-cover bg-slate-950 border-4 border-slate-950"
                />
              </div>
              {displayUser?.subscriptionTier === 'premium' && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-300 to-orange-500 text-slate-950 p-1.5 rounded-full border-4 border-slate-950 shadow-lg">
                  <Crown className="w-5 h-5 fill-current" />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">{displayUser?.firstName} {displayUser?.lastName}</h2>
            <p className="text-slate-500 text-sm mb-4 font-mono">{displayUser?.emailId}</p>

            <div className="flex items-center gap-2 mb-8">
              <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold text-cyan-400 uppercase tracking-wide shadow-inner">
                {displayUser?.role}
              </span>
              {displayUser?.isEmailVerified && (
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400 uppercase tracking-wide flex items-center gap-1 shadow-inner">
                  <CheckCircle className="w-3 h-3"/> Verified
                </span>
              )}
            </div>

            <div className="w-full grid grid-cols-2 gap-3 mb-8">
              <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800 flex flex-col items-center">
                <Calendar className="w-4 h-4 text-cyan-500 mb-1" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Joined</span>
                <span className="text-sm font-bold text-white">{formatDate(displayUser?.createdAt)}</span>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800 flex flex-col items-center">
                <MapPin className="w-4 h-4 text-cyan-500 mb-1" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Location</span>
                <span className="text-sm font-bold text-white">Ujjain, IN</span>
              </div>
            </div>

            <div className="w-full text-left mt-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> System Limits
                </h3>
                {displayUser?.subscriptionTier !== 'premium' && (
                   <Link to="/price" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                     Upgrade <ArrowRight className="w-3 h-3" />
                   </Link>
                )}
              </div>
              <div className="space-y-3">
                <UsageGauge value={displayUser?.usageLimits?.codeExecutions?.used || 0} max={displayUser?.usageLimits?.codeExecutions?.limit || 25} icon={Terminal} color="#06b6d4" label="Compilations" />
                <UsageGauge value={displayUser?.usageLimits?.aiChatQueries?.used || 0} max={displayUser?.usageLimits?.aiChatQueries?.limit || 10} icon={MessageSquare} color="#8b5cf6" label="AI Assistant" />
                <UsageGauge value={displayUser?.usageLimits?.videoSolutionViews?.used || 0} max={displayUser?.usageLimits?.videoSolutionViews?.limit || 5} icon={PlayCircle} color="#ec4899" label="Video Solutions" />
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Stats & Content (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* --- IMPROVED SOLVING STATS --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                    <Activity className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Performance Metrics</h2>
                    <p className="text-sm text-slate-400">Solved vs. Global Question Bank</p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-3xl font-bold text-white">{stats.solved.all}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Solved</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                
                {/* 1. Visual Donut Chart */}
                <div className="md:col-span-2 flex justify-center items-center relative">
                  <div className="relative w-52 h-52">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[60px]" />
                    
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 relative z-10">
                      {/* Track */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="6" />
                      
                      {/* Segments */}
                      {totalSolved > 0 && (
                        <>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="6"
                            strokeDasharray={`${(easyDeg / 360) * 251.2} 251.2`} strokeDashoffset="0"
                          />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eab308" strokeWidth="6"
                            strokeDasharray={`${(mediumDeg / 360) * 251.2} 251.2`} strokeDashoffset={-((easyDeg / 360) * 251.2)}
                          />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="6"
                            strokeDasharray={`${((360 - easyDeg - mediumDeg) / 360) * 251.2} 251.2`} strokeDashoffset={-(((easyDeg + mediumDeg) / 360) * 251.2)}
                          />
                        </>
                      )}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Solved</span>
                      <span className="text-4xl font-bold text-white">{stats.solved.all}</span>
                      <span className="text-slate-500 text-xs font-mono mt-1">/ {stats.totals.all}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Detailed Cards */}
                <div className="md:col-span-3 flex flex-col justify-center gap-4">
                  <StatCard label="Easy" color="emerald" solved={stats.solved.easy} total={stats.totals.easy} />
                  <StatCard label="Medium" color="amber" solved={stats.solved.medium} total={stats.totals.medium} />
                  <StatCard label="Hard" color="rose" solved={stats.solved.hard} total={stats.totals.hard} />
                </div>
              </div>
            </motion.div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strongest Topics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white">Top Topics</h3>
                </div>
                <div className="flex-1">
                  {topTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {topTopics.map(([topic, count]) => (
                        <div key={topic} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/30 transition-colors cursor-default">
                          <span className="text-slate-300 text-sm capitalize">{topic}</span>
                          <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-1.5 py-0.5 rounded border border-cyan-500/20">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 p-4 border border-dashed border-slate-800 rounded-xl">
                      <Hash className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-sm">Solve problems to see topic analysis.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white">Recent Activity</h3>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {solvedProblems.length > 0 ? (
                    solvedProblems.slice(0, 4).map((problem) => (
                      <Link 
                        key={problem._id} 
                        to={`/problem/${problem._id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800 hover:border-slate-700 border border-transparent transition-all group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-1 h-8 rounded-full ${problem.difficulty === 'Easy' ? 'bg-green-500' : problem.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                          <div className="truncate">
                            <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors truncate">{problem.title}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold">{problem.difficulty}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                      </Link>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 p-4 border border-dashed border-slate-800 rounded-xl">
                      <Code className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-sm">Start coding to see history.</p>
                      <Link to="/problems" className="mt-2 text-xs text-cyan-400 hover:underline">Go to Problems</Link>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;