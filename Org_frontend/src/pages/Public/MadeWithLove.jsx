import React from "react";
import { Heart, Code2, Terminal, Sparkles } from "lucide-react";

const MadeWithLove = () => {
  return (
    <div className="relative mt-20 mb-10 flex justify-center px-4 text-sm">

      {/* Ambient Glow */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-[480px] h-16 bg-cyan-500/10 blur-3xl rounded-full" />
      </div>

      {/* Signature Card */}
      <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-3 shadow-xl">
        
        {/* Left Icon */}
        <div className="flex items-center gap-2 text-cyan-400 font-mono">
          <Terminal size={16} />
          <span className="text-xs tracking-wider">SYSTEM_LOG</span>
        </div>

        {/* Divider */}
        <span className="hidden sm:block text-slate-600">|</span>

        {/* Message */}
        <div className="flex flex-wrap items-center gap-2 text-slate-300">
          <span>DSA Buddy was</span>

          <span className="flex items-center gap-1">
            built with
            <Heart
              size={14}
              className="text-red-500 animate-pulse"
              fill="currentColor"
            />
          </span>
          <span>by</span>

          <span className="text-white font-semibold">
            Prateek Thakur
          </span>
        </div>

        {/* Right Accent */}
        <Sparkles size={14} className="text-yellow-400" />
      </div>
    </div>
  );
};

export default MadeWithLove;
