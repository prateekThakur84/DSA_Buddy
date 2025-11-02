import { motion } from "framer-motion";
import { Link } from "react-router";

const NavItem = ({
  item,
  isActive,
  onClick,
  scrolled = false,
  className = "",
}) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={`relative ${className}`}
      onClick={() => onClick(item.id)}
    >
      <motion.button
        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          isActive
            ? "text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-4 h-4" />
        <span className={scrolled ? "hidden lg:block" : ""}>{item.label}</span>
      </motion.button>
    </Link>
  );
};

export default NavItem;
