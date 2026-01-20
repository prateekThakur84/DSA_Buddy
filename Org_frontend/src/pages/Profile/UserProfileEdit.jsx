import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { 
  User, 
  Save, 
  Image as ImageIcon, 
  Calendar,
  Loader2,
  Mail,
  AlertCircle,
  Crown,
  Terminal,
  MessageSquare,
  PlayCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { checkAuth } from '../../store/slices/authSlice';

// --- Internal Component: Circular Progress Chart (Themed) ---
const CircularProgress = ({ value, max, color, icon: Icon, label }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / (max || 1)) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all group hover:bg-slate-800/50">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#1e293b" // slate-800
            strokeWidth="6"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Icon in Center */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</div>
        <div className="text-[10px] text-slate-600 mt-1">Limit: {max}</div>
      </div>
    </div>
  );
};

// --- Main Component ---
const UserProfileEdit = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.put('/auth/profile', formData);
      if (response.data.success) {
        await dispatch(checkAuth());
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
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
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              Settings & Preferences
              {user?.subscriptionTier === 'premium' && (
                <span className="px-3 py-1 text-xs font-bold text-black bg-gradient-to-r from-amber-300 to-orange-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center gap-1">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              )}
            </h1>
            <p className="text-slate-400 mt-2">Manage your personal information and view account limits.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => navigate('/profile')}
               className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
             >
               Discard Changes
             </button>
             <button 
               onClick={handleSubmit}
               disabled={loading}
               className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               Save Changes
             </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (4 cols): Quick Stats & Identity */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* ID Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
               {/* Subtle Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               
               <div className="relative flex flex-col items-center">
                 <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] mb-4">
                    <img 
                      src={formData.profilePicture || "https://via.placeholder.com/150"} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover border-4 border-slate-950 bg-slate-800"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=User"; }}
                    />
                 </div>
                 <h2 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
                 <p className="text-slate-500 font-mono text-xs mb-6">{user?.emailId}</p>
                 
                 <div className="flex gap-2 w-full justify-center">
                   <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                     <ShieldCheck className="w-3.5 h-3.5" />
                     {user?.role?.toUpperCase()}
                   </div>
                   <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-green-400 flex items-center gap-1.5">
                     <TrendingUp className="w-3.5 h-3.5" />
                     ACTIVE
                   </div>
                 </div>
               </div>
            </div>

            {/* Usage Graphics */}
           
         
           
          </motion.div>

          {/* RIGHT COLUMN (8 cols): Edit Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative">
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section: Profile Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Public Avatar</h3>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Image URL</label>
                    <div className="flex gap-4">
                      <div className="relative flex-1 group">
                        <ImageIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="url"
                          name="profilePicture"
                          value={formData.profilePicture}
                          onChange={handleChange}
                          placeholder="https://imgur.com/..."
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">We currently support direct image URLs. Hosting support coming soon.</p>
                  </div>
                </div>

                {/* Section: Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Personal Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">First Name <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Last Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Age</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="number"
                          name="age"
                          min="6"
                          max="100"
                          value={formData.age}
                          onChange={handleChange}
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                        <input
                          type="email"
                          value={user?.emailId || ''}
                          disabled
                          className="w-full bg-slate-900/30 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-500 cursor-not-allowed select-none font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions - Duplicate for convenience */}
                <div className="pt-6 border-t border-slate-800 flex justify-end">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Profile
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEdit;