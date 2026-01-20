import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Mail, 
  Calendar, 
  Code2, 
  CreditCard, 
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  ShieldAlert,
  Terminal,
  Ban
} from 'lucide-react';
import { fetchUserDetails, clearCurrentUser } from '../../store/slices/adminSlice';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser, userStats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUserDetails(id));
    return () => {
      dispatch(clearCurrentUser());
    };
  }, [dispatch, id]);

  // --- ANIMATION VARIANTS (Matched to AboutPage) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center relative overflow-hidden">
        {/* Loading Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-500/80 font-mono text-sm tracking-widest uppercase animate-pulse">Retrieving User Data...</p>
        </div>
      </div>
    );
  }

  // Data for Pie Chart
  const difficultyData = [
    { name: 'Easy', value: userStats?.easy || 0, color: '#10b981' },
    { name: 'Medium', value: userStats?.medium || 0, color: '#f59e0b' },
    { name: 'Hard', value: userStats?.hard || 0, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 pb-20 relative overflow-x-hidden">
      
      {/* --- BACKGROUND: CYBER GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B1120] to-[#000000]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/admin/users" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium uppercase tracking-wide">Back to Database</span>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* --- HEADER PROFILE CARD --- */}
          <motion.div 
            variants={itemVariants}
            className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-8 relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-500"
          >
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-50" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-slate-950 border border-slate-700/50 flex items-center justify-center text-4xl text-white font-bold shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-transparent"></div>
                  {currentUser.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="" className="w-full h-full rounded-2xl object-cover relative z-10" />
                  ) : (
                    <span className="relative z-10 bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                      {currentUser.firstName?.charAt(0)}
                    </span>
                  )}
                </div>
                {/* Verification Badge */}
                <div className={`absolute -bottom-3 -right-3 p-2 rounded-xl border-4 border-[#0B1120] shadow-lg ${currentUser.isEmailVerified ? 'bg-emerald-500 text-[#0B1120]' : 'bg-slate-700 text-slate-300'}`}>
                  {currentUser.isEmailVerified ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold text-white tracking-tight">{currentUser.firstName} {currentUser.lastName}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    currentUser.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                    currentUser.role === 'premium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    'bg-slate-500/10 text-cyan-400 border-slate-500/20'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400 text-sm font-medium">
                  <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                    <Mail className="w-4 h-4 text-slate-500" /> {currentUser.emailId}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" /> Joined {new Date(currentUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <button className="flex items-center gap-2 px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-bold uppercase tracking-wide rounded-xl border border-rose-500/20 transition-all hover:scale-105 active:scale-95">
                  <Ban className="w-4 h-4" />
                  Suspend User
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN: STATS & LISTS --- */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Problems Solved */}
                <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Terminal size={64} />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-400"><Code2 className="w-5 h-5" /></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Problems Solved</span>
                  </div>
                  <p className="text-3xl font-bold text-white font-mono">{userStats?.totalSolved}</p>
                </motion.div>

                {/* Total Spent */}
                <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CreditCard size={64} />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400"><CreditCard className="w-5 h-5" /></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Lifetime Value</span>
                  </div>
                  <p className="text-3xl font-bold text-white font-mono">
                    ₹{currentUser.paymentHistory?.reduce((acc, curr) => acc + (curr.amount || 0), 0) / 100 || 0}
                  </p>
                </motion.div>

                {/* Last Active */}
                <motion.div variants={itemVariants} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Clock size={64} />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400"><Clock className="w-5 h-5" /></div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Last Active</span>
                  </div>
                  <p className="text-lg font-bold text-white mt-2">
                    {currentUser.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleDateString() : 'Never'}
                  </p>
                </motion.div>
              </div>

              {/* Solved Problems List */}
              <motion.div 
                variants={itemVariants}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" /> Activity Log
                  </h3>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {currentUser.problemSolved && currentUser.problemSolved.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-950/50 text-xs uppercase font-bold text-slate-500 sticky top-0 backdrop-blur-md z-10">
                        <tr>
                          <th className="p-5">Problem Title</th>
                          <th className="p-5">Difficulty</th>
                          <th className="p-5 text-right">Solved On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {currentUser.problemSolved.map((problem) => (
                          <tr key={problem._id} className="hover:bg-cyan-500/5 transition-colors group">
                            <td className="p-5 text-slate-300 font-medium group-hover:text-white transition-colors">{problem.title}</td>
                            <td className="p-5">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                                problem.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' :
                                problem.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/5 border-amber-500/20' :
                                'text-rose-400 bg-rose-500/5 border-rose-500/20'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </td>
                            <td className="p-5 text-right text-slate-500 font-mono text-xs">
                              {new Date(problem.createdAt || Date.now()).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                      <ShieldAlert className="w-10 h-10 mb-3 opacity-20" />
                      <p>No activity recorded for this user yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* --- RIGHT COLUMN: CHARTS & INFO --- */}
            <div className="space-y-6">
              
              {/* Difficulty Chart */}
              <motion.div 
                variants={itemVariants}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                   Skill Distribution
                </h3>
                
                <div className="h-[220px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={6}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} className="stroke-slate-900 stroke-2" />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        formatter={(value) => [`${value} Problems`, 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-bold text-white">{userStats?.totalSolved}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Total Solved</span>
                  </div>
                </div>

                {/* Custom Legend */}
                <div className="flex justify-center gap-4 mt-6">
                  {difficultyData.map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
                      <span className="text-sm font-bold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Transaction History */}
              <motion.div 
                variants={itemVariants}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6"
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   Billing History
                </h3>
                <div className="space-y-3">
                  {currentUser.paymentHistory && currentUser.paymentHistory.length > 0 ? (
                    currentUser.paymentHistory.map((payment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold capitalize">{payment.planType || 'Premium Subscription'}</p>
                            <p className="text-xs text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="text-white font-mono text-sm font-bold">₹{payment.amount / 100}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl">
                      <p className="text-slate-500 text-sm">No transaction history.</p>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDetail;