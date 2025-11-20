import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Video, 
  BarChart3,
  Users,
  BookOpen,
  Settings,
  Shield
} from 'lucide-react';
import axiosClient from '../../utils/axiosClient';

const Admin = () => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalUsers: 0,
    totalSubmissions: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      // Fetch problems count
      const problemsResponse = await axiosClient.get('/problem/getAllProblem');
      setStats(prev => ({
        ...prev,
        totalProblems: problemsResponse.data.length
      }));
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminActions = [
    {
      title: 'Create Problem',
      description: 'Add new coding problems with test cases',
      icon: Plus,
      path: '/admin/create',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-400/10 border-green-400/20'
    },
    {
      title: 'Manage Problems',
      description: 'Edit or delete existing problems',
      icon: Edit,
      path: '/admin/delete',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-400/10 border-blue-400/20'
    },
    {
      title: 'Video Solutions',
      description: 'Upload and manage video solutions',
      icon: Video,
      path: '/admin/videos',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-400/10 border-purple-400/20'
    },
    {
      title: 'Analytics',
      description: 'View platform statistics and insights',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-400/10 border-cyan-400/20'
    }
  ];

  const statsCards = [
    {
      title: 'Total Problems',
      value: stats.totalProblems,
      icon: BookOpen,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10 border-cyan-400/20'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10 border-green-400/20'
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10 border-purple-400/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-cyan-400 font-medium">Loading admin dashboard...</span>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">Manage your DSA platform</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-black/20 backdrop-blur-lg border rounded-xl p-6 ${stat.bgColor}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path}>
                  <motion.div
                    className={`bg-black/20 backdrop-blur-lg border rounded-xl p-6 hover:bg-black/30 transition-all duration-300 group cursor-pointer ${action.bgColor}`}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-100 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                      {action.description}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-cyan-400" />
            Platform Overview
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">System Status</span>
              </div>
              <span className="text-green-400 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-300">Database</span>
              </div>
              <span className="text-cyan-400 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Code Execution</span>
              </div>
              <span className="text-blue-400 font-medium">Active</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;