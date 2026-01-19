import { motion } from "framer-motion";
import { Link } from "react-router";
import { ANIMATION_VARIANTS } from "./navigationConstants";

const Logo = ({ scrolled }) => {
  return (
    <motion.div
      className="flex items-center space-x-3"
      variants={ANIMATION_VARIANTS.sideElements}
      animate={scrolled ? "hidden" : "visible"}
    >
      <Link to="/" className="flex items-center space-x-3 group select-none">
        
        {/* Icon Container */}
        <div className="w-10 h-10 relative flex items-center justify-center">
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transform transition-transform duration-300 group-hover:scale-110"
          >
            <defs>
              <linearGradient
                id="simple-code-grad"
                x1="0"
                y1="0"
                x2="512"
                y2="512"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan-400 */}
                <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
              </linearGradient>
            </defs>

            {/* The Code Symbol Group */}
            <g stroke="url(#simple-code-grad)" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round">
                {/* Left Bracket < */}
                <path d="M160 128 L64 256 L160 384" />
                
                {/* The Slash / */}
                <path d="M210 416 L302 96" />
                
                {/* Right Bracket > */}
                <path d="M352 128 L448 256 L352 384" />
            </g>
          </svg>
        </div>

        <span className="text-xl font-bold text-white tracking-tight">
          DSA<span className="text-cyan-400">Buddy</span>
        </span>
      </Link>
    </motion.div>
  );
};

export default Logo;