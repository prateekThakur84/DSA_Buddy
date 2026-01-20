import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router'; 
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Video, 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings, 
  Shield, 
  Activity, 
  Server,
  Code2
} from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { fetchUsers } from '../../store/slices/adminSlice'; // Import from your slice

const Admin = () => {
  const dispatch = useDispatch();
  
  // Get User count from Redux
  const { pagination: userPagination } = useSelector((state) => state.admin);
  
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalUsers: 0, 
    totalSubmissions: 0, // Placeholder until submission API is ready
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      setLoading(true);
      try {
        // 1. Fetch Problems Count (Direct API)
        const problemsResponse = await axiosClient.get('/problem/getAllProblem');
        
        // 2. Fetch Users Count (Via Redux Action)
        // We fetch page 1 just to get the 'totalRecords' in metadata
        await dispatch(fetchUsers({ page: 1 }));

        setStats(prev => ({
          ...prev,
          totalProblems: problemsResponse.data.length,
          // Note: totalUsers will be updated via useSelector below, 
          // but we can set a local fallback here if needed.
        }));
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [dispatch]);

  // Sync Redux state to local stats when it changes
  useEffect(() => {
    if (userPagination?.totalRecords) {
      setStats(prev => ({
        ...prev,
        totalUsers: userPagination.totalRecords
      }));
    }
  }, [userPagination]);

  const adminActions = [
    {
      title: 'Create Problem',
      description: 'Add new coding challenges.',
      icon: Plus,
      path: '/admin/create',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      border: 'hover:border-emerald-500/50'
    },
   
    {
      title: 'Delete Problems',
      description: 'Delete content.',
      icon: Edit,
      path: '/admin/delete', // Consider changing to /admin/problems if you have a list view
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      border: 'hover:border-blue-500/50'
    },
    {
      title: 'User Management',
      description: 'Control access & roles.',
      icon: Users,
      path: '/admin/userManage', // Updated path
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
      border: 'hover:border-cyan-500/50'
    },
    {
      title: 'Video Solutions',
      description: 'Upload tutorials.',
      icon: Video,
      path: '/admin/videos',
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      border: 'hover:border-purple-500/50'
    }
  ];

  const statsCards = [
    {
      title: 'Total Problems',
      value: stats.totalProblems,
      icon: Code2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      title: 'System Health',
      value: "98%", // Static for now
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono tracking-widest uppercase animate-pulse">Initializing Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* --- BACKGROUND: CYBER GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B1120] to-[#000000]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] animate-pulse" />
      </div>

      <div className="container mx-auto px-6 pt-28 pb-12 relative z-10 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-center gap-6"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20 border border-white/10">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-1">Admin Console</h1>
            <p className="text-slate-400 text-lg">Overview of platform resources and user metrics.</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-slate-900/40 backdrop-blur-xl border ${stat.border} rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group`}
              >
                {/* Background Glow */}
                <div className={`absolute -right-6 -top-6 p-16 opacity-10 rounded-full blur-3xl ${stat.bg.replace('/10', '/30')}`} />
                
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.title}</p>
                    <p className={`text-4xl font-bold ${stat.color} tracking-tight font-mono`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg}`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path} className="block h-full group">
                  <motion.div
                    className={`bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 h-full transition-all duration-300 ${action.border} hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-black/50`}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`text-lg font-bold text-white mb-2 group-hover:${action.textColor} transition-colors`}>
                      {action.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {action.description}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/30 backdrop-blur-md border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            System Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Item 1 */}
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 font-medium text-sm">API Gateway</span>
              </div>
              <span className="text-emerald-400 font-bold text-xs tracking-wider bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">ONLINE</span>
            </div>
            
            {/* Status Item 2 */}
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                <span className="text-slate-300 font-medium text-sm">MongoDB</span>
              </div>
              <span className="text-cyan-400 font-bold text-xs tracking-wider bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">CONNECTED</span>
            </div>

            {/* Status Item 3 */}
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <span className="text-slate-300 font-medium text-sm">Judge0 Engine</span>
              </div>
              <span className="text-blue-400 font-bold text-xs tracking-wider bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">READY</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Admin;