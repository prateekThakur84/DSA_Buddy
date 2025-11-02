import { motion } from "framer-motion";
import { Link } from "react-router";
import { Code } from "lucide-react";
import { ANIMATION_VARIANTS } from "./navigationConstants";

const Logo = ({ scrolled }) => {
  return (
    <motion.div
      className="flex items-center space-x-3"
      variants={ANIMATION_VARIANTS.sideElements}
      animate={scrolled ? "hidden" : "visible"}
    >
      <Link to="/" className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg">
          <Code className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          DSA Buddy
        </span>
      </Link>
    </motion.div>
  );
};

export default Logo;
