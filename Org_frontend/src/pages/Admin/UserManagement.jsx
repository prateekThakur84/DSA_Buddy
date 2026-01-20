import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MoreVertical,
  ShieldAlert,
  Trash2,
  CheckCircle,
  User as UserIcon,
  Crown,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  fetchUsers,
  updateUserRole,
  deleteUser,
  clearAdminError,
} from "../../store/slices/adminSlice";
import toast from "react-hot-toast";
import { Link } from "react-router"; // Use 'react-router-dom' if 'react-router' fails

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, pagination, actionLoading, error } = useSelector(
    (state) => state.admin
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeMenu, setActiveMenu] = useState(null);

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchUsers({ page: 1, search: searchTerm, role: roleFilter }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  const handleRoleUpdate = async (userId, newRole, e) => {
    e.stopPropagation(); // Prevent closing menu immediately or bubbling
    if (actionLoading) return; // Prevent double clicks
    
    await dispatch(updateUserRole({ userId, role: newRole }));
    setActiveMenu(null);
    toast.success(`User role updated to ${newRole.toUpperCase()}`);
  };

  const handleDeleteUser = async (userId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      await dispatch(deleteUser(userId));
      toast.success("User deleted successfully");
    }
    setActiveMenu(null);
  };

  // Component for displaying the current role in the table
  const RoleBadge = ({ role }) => {
    const styles = {
      admin: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
      premium: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
      user: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };

    const icons = {
      admin: <ShieldAlert className="w-3 h-3 mr-1.5" />,
      premium: <Crown className="w-3 h-3 mr-1.5" />,
      user: <UserIcon className="w-3 h-3 mr-1.5" />,
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${styles[role] || styles.user}`}>
        {icons[role] || icons.user}
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* --- BACKGROUND: CYBER GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B1120] to-[#000000]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] animate-pulse" />
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
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">
                Admin Console
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              User Database
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Control access levels, manage roles, and monitor user growth.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative flex items-center bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                <Search className="absolute left-3 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none w-64 placeholder:text-slate-600 text-sm"
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 group-hover:border-purple-500/30 flex items-center transition-colors">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none bg-transparent text-slate-200 pl-4 pr-10 py-3 rounded-xl focus:outline-none cursor-pointer hover:text-white transition-colors text-sm font-medium"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="premium">Premium</option>
                  <option value="admin">Admin</option>
                </select>
                <Filter className="absolute right-3 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* --- TABLE CARD --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          // Note: Removed overflow-hidden to allow dropdowns to pop out, using min-h to prevent clipping
          className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative min-h-[400px]"
        >
          {/* Top Sheen */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />

          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-6">User Profile</th>
                  <th className="p-6">Verification</th>
                  <th className="p-6">Current Role</th>
                  <th className="p-6">Joined Date</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
                        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                        <span className="text-sm font-mono animate-pulse">
                          Fetching user data...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <XCircle className="w-10 h-10 text-slate-700" />
                        <p>No users found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-800/40 transition-colors group relative"
                    >
                      {/* User Profile */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold border border-slate-700 shadow-lg overflow-hidden group-hover:border-slate-600 transition-colors">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent text-lg">
                                  {user.firstName?.charAt(0) || "U"}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              <Link to={`/admin/users/${user._id}`} className="hover:underline">
                                {user.firstName} {user.lastName}
                              </Link>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-mono">
                              <Mail className="w-3 h-3" /> {user.emailId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="p-6">
                        {user.isEmailVerified ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle className="w-4 h-4" /> Verified
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <div className="w-3 h-3 rounded-full border-2 border-slate-600" />
                            Pending
                          </div>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="p-6">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Date */}
                      <td className="p-6 text-slate-400 text-sm font-mono">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-600" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Actions with Dropdown */}
                      <td className="p-6 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === user._id ? null : user._id);
                          }}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            activeMenu === user._id
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "text-slate-500 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu - Positioned Absolute with High Z-Index */}
                        <AnimatePresence>
                          {activeMenu === user._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10, x: -20 }}
                              animate={{ opacity: 1, scale: 1, y: 0, x: -20 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-0 top-12 w-64 bg-[#0B1120] border border-slate-700 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden ring-1 ring-white/10"
                            >
                              <div className="p-2">
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 mb-1">
                                  Modify User Access
                                </div>
                                
                                {["user", "premium", "admin"].map((r) => (
                                  <button
                                    key={r}
                                    onClick={(e) => handleRoleUpdate(user._id, r, e)}
                                    disabled={user.role === r || actionLoading === user._id}
                                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center justify-between mb-1 transition-all ${
                                      user.role === r
                                        ? "bg-cyan-500/10 text-cyan-400 font-bold"
                                        : "text-slate-300 hover:bg-slate-800 hover:translate-x-1"
                                    } ${actionLoading === user._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {r === "admin" ? (
                                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                                      ) : r === "premium" ? (
                                        <Crown className="w-4 h-4 text-amber-400" />
                                      ) : (
                                        <UserIcon className="w-4 h-4 text-slate-400" />
                                      )}
                                      <span>
                                        Make {r.charAt(0).toUpperCase() + r.slice(1)}
                                      </span>
                                    </div>
                                    
                                    {/* Show Loader if processing this specific action, else checkmark if active */}
                                    {actionLoading === user._id && user.role !== r ? (
                                       <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : user.role === r ? (
                                       <CheckCircle className="w-3.5 h-3.5" />
                                    ) : null}
                                  </button>
                                ))}

                                <div className="h-px bg-slate-800 my-1.5 mx-1" />
                                
                                <button
                                  onClick={(e) => handleDeleteUser(user._id, e)}
                                  disabled={actionLoading === user._id}
                                  className="w-full text-left px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg flex items-center gap-3 transition-all hover:translate-x-1 font-medium group/del"
                                >
                                  <Trash2 className="w-4 h-4 group-hover/del:text-rose-500" />
                                  Delete Account
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION --- */}
          <div className="p-4 border-t border-slate-800/50 bg-slate-950/20 flex items-center justify-between text-sm text-slate-500">
            <span className="pl-2">
              Showing <span className="text-white font-medium">{users.length}</span> of{" "}
              <span className="text-white font-medium">
                {pagination.totalRecords}
              </span>{" "}
              users
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.current === 1}
                onClick={() =>
                  dispatch(
                    fetchUsers({
                      page: pagination.current - 1,
                      search: searchTerm,
                      role: roleFilter,
                    })
                  )
                }
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Previous
              </button>
              <button
                disabled={pagination.current === pagination.total}
                onClick={() =>
                  dispatch(
                    fetchUsers({
                      page: pagination.current + 1,
                      search: searchTerm,
                      role: roleFilter,
                    })
                  )
                }
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 group"
              >
                Next
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Click outside listener */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;