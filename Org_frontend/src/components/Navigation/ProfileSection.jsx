import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { ANIMATION_VARIANTS } from "./navigationConstants";
import { getUserInitials } from "./navigationUtils";
import { useClickOutside, useProfileDropdown } from "./navigationHooks";

const AuthButtons = () => (
  <div className="flex items-center space-x-2">
    <Link to="/login">
      <motion.button
        className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Login
      </motion.button>
    </Link>
    <Link to="/signup">
      <motion.button
        className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Sign Up
      </motion.button>
    </Link>
  </div>
);

const ProfileButton = ({ user, onClick, isOpen }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 bg-black/20 hover:bg-black/30 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/30 rounded-full px-3 py-2"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {/* Profile Picture */}
    <div className="relative">
      {user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400/30"
        />
      ) : (
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center border-2 border-cyan-400/30">
          <span className="text-sm font-semibold text-white">
            {getUserInitials(user)}
          </span>
        </div>
      )}
      {/* Online Status Indicator */}
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-black rounded-full"></div>
    </div>

    {/* User Name */}
    <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">
      {user?.firstName || user?.email || "User"}
    </span>

    {/* Dropdown Arrow */}
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <ChevronDown className="w-4 h-4" />
    </motion.div>
  </motion.button>
);

const ProfileSection = ({ scrolled, isAuthenticated, user }) => {
  const dropdownRef = useRef(null);
  const { profileDropdownOpen, toggleProfileDropdown, closeProfileDropdown } =
    useProfileDropdown();

  useClickOutside(dropdownRef, closeProfileDropdown);

  return (
    <motion.div
      className="flex items-center space-x-4"
      variants={ANIMATION_VARIANTS.sideElements}
      animate={scrolled ? "hidden" : "visible"}
    >
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <ProfileButton
            user={user}
            onClick={toggleProfileDropdown}
            isOpen={profileDropdownOpen}
          />
          <ProfileDropdown
            isOpen={profileDropdownOpen}
            onClose={closeProfileDropdown}
            user={user}
          />
        </div>
      ) : (
        <AuthButtons />
      )}
    </motion.div>
  );
};

export default ProfileSection;
