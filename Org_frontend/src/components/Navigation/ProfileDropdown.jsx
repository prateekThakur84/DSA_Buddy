import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import {
  PROFILE_DROPDOWN_ITEMS,
  ANIMATION_VARIANTS,
} from "./navigationConstants";
import { getUserInitials, getDisplayName } from "./navigationUtils";

const ProfileDropdown = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  const handleItemClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
    absolute right-0 mt-2
    w-56
    bg-cyan-900/50         /* slightly more opaque */
    backdrop-blur-md        /* moderate frosted glass */
    border border-cyan-200/30
    rounded-xl
    shadow-lg shadow-black/50
    overflow-hidden
    z-50
  "
          variants={ANIMATION_VARIANTS.dropdown}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-cyan-200/30">
            <div className="flex items-center space-x-2">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-cyan-200/40"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center border-2 border-cyan-200/40">
                  <span className="text-base font-semibold text-white">
                    {getUserInitials(user)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate text-sm">
                  {getDisplayName(user)}
                </p>
                <p className="text-gray-200 text-xs truncate">{user?.email}</p>
                {user?.role === "admin" && (
                  <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-[10px] text-white rounded-full mt-1">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {PROFILE_DROPDOWN_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={handleItemClick}
                  className="group"
                >
                  <motion.div
                    className="flex items-center px-3 py-2 text-gray-200 hover:text-white hover:bg-cyan-700/30 transition-all duration-200"
                    whileHover={{ x: 4 }}
                  >
                    <Icon className="w-4 h-4 mr-2 text-cyan-300 group-hover:text-cyan-200" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-[11px] text-gray-400 group-hover:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-cyan-200/30"></div>

          {/* Logout Button */}
          <div className="py-1">
            <motion.button
              onClick={handleLogout}
              className="group w-full flex items-center px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
              whileHover={{ x: 4 }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Sign Out</p>
                <p className="text-[11px] text-red-500 group-hover:text-red-400">
                  Log out of your account
                </p>
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
