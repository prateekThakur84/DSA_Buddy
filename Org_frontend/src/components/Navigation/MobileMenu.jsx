import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import {
  NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  PROFILE_DROPDOWN_ITEMS,
  ANIMATION_VARIANTS,
} from "./navigationConstants";
import { getUserInitials, getDisplayName } from "./navigationUtils";

const MobileNavItem = ({ item, isActive, onClick, onClose }) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
          : "text-gray-300 hover:text-white hover:bg-white/10"
      }`}
      onClick={() => {
        onClick(item.id);
        onClose();
      }}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{item.label}</span>
    </Link>
  );
};

const MobileProfileSection = ({ user, onClose }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  return (
    <div className="border-t border-cyan-400/10 pt-4 mt-4">
      {/* User Info */}
      <div className="flex items-center space-x-3 px-4 py-2 mb-2">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400/30"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center border-2 border-cyan-400/30">
            <span className="text-sm font-semibold text-white">
              {getUserInitials(user)}
            </span>
          </div>
        )}
        <div>
          <p className="text-white font-medium">{getDisplayName(user)}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Profile Menu Items */}
      {PROFILE_DROPDOWN_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
};

const MobileAuthButtons = ({ onClose }) => (
  <div className="border-t border-cyan-400/10 pt-4 mt-4 space-y-2">
    <Link to="/login" onClick={onClose}>
      <button className="w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
        Login
      </button>
    </Link>
    <Link to="/signup" onClick={onClose}>
      <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200">
        Sign Up
      </button>
    </Link>
  </div>
);

const MobileMenu = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Combine navigation items
  const allNavItems = [
    ...NAV_ITEMS,
    ...(isAuthenticated && user?.role === "admin" ? ADMIN_NAV_ITEMS : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="md:hidden bg-black/95 backdrop-blur-xl border-t border-cyan-400/20"
          variants={ANIMATION_VARIANTS.mobileMenu}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 space-y-2">
            {/* Navigation Items */}
            {allNavItems.map((item) => (
              <MobileNavItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={setActiveTab}
                onClose={onClose}
              />
            ))}

            {/* Profile or Auth Section */}
            {isAuthenticated ? (
              <MobileProfileSection user={user} onClose={onClose} />
            ) : (
              <MobileAuthButtons onClose={onClose} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
