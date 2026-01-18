import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Code2,
  Terminal,
  Cpu,
  Globe,
  Zap,
  Database,
  ShieldCheck,
  Linkedin,
  Github,
  Mail,
  Award,
  Rocket,
  ChevronRight,
  Server,
  CreditCard,
  TrendingUp,
  Layout,
  User,
  MapPin,
  Briefcase,
} from "lucide-react";

// Adjust path based on your folder structure
import Navigation from "../../components/Navigation/Navigation";
import MadeWithLove from "./MadeWithLove";

const AboutPage = () => {
  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

  const floatAnimation = {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <Navigation />

      {/* --- UPGRADED BACKGROUND: CYBER GRID --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B1120] to-[#000000]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] animate-pulse" />
      </div>

      {/* --- SECTION 1: HERO --- */}
      <section className="relative z-10  pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
           

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white tracking-tight"
            >
              Master Data Structures <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Without the Confusion
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              DSA Buddy is a complete placement ecosystem designed to replace
              fragmented tools. Write code, get AI assistance, and visualize
              solutions—all in one intelligent platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/problems">
                <button className="group relative px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <span className="flex items-center gap-2 relative z-10">
                    Start Practicing <ChevronRight size={16} />
                  </span>
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 2: ARCHITECTURE (TECH STACK) --- */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Engineering First
            </h2>
            <p className="text-slate-400">
              Built on a robust MERN architecture designed for scale and speed.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Tech Item 1 */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-green-500/30 transition-all duration-300 hover:bg-slate-800/50"
            >
              <div className="p-3 bg-green-500/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Database className="text-green-400" size={24} />
              </div>
              <h3 className="text-white font-bold mb-1">MongoDB & Redis</h3>
              <p className="text-xs text-slate-500">
                Optimized data retrieval & caching.
              </p>
            </motion.div>
            {/* Tech Item 2 */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/50"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Layout className="text-blue-400" size={24} />
              </div>
              <h3 className="text-white font-bold mb-1">React & Tailwind</h3>
              <p className="text-xs text-slate-500">
                Modern UI with Framer Motion.
              </p>
            </motion.div>
            {/* Tech Item 3 */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-purple-500/30 transition-all duration-300 hover:bg-slate-800/50"
            >
              <div className="p-3 bg-purple-500/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="text-purple-400" size={24} />
              </div>
              <h3 className="text-white font-bold mb-1">Gemini AI Engine</h3>
              <p className="text-xs text-slate-500">
                Context-aware hints in 2s.
              </p>
            </motion.div>
            {/* Tech Item 4 */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-yellow-500/30 transition-all duration-300 hover:bg-slate-800/50"
            >
              <div className="p-3 bg-yellow-500/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Server className="text-yellow-400" size={24} />
              </div>
              <h3 className="text-white font-bold mb-1">Judge0 & Node.js</h3>
              <p className="text-xs text-slate-500">
                Handling 500+ daily submissions.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 3: KEY FEATURES --- */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Why DSA Buddy?
            </h2>
            <p className="text-slate-400 max-w-2xl">
              We bridge the gap between "Stuck" and "Solved" with
              industry-standard tools.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Judge0 Feature */}
            <motion.div
              variants={itemVariants}
              className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-all"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Terminal size={180} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 text-cyan-400">
                  <Terminal size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Real-Time Execution Engine
                </h3>
                <p className="text-slate-400 max-w-md mb-6">
                  Don't just write code—test it. Our integrated{" "}
                  <strong>Judge0 API</strong> supports C++, Java, Python, and
                  JavaScript with <strong>98% accuracy</strong>. Experience a
                  real interview environment.
                </p>
              </div>
            </motion.div>

            {/* Premium Feature */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl group hover:border-yellow-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6 text-yellow-400">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Premium Access
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Seamlessly upgrade via <strong>Razorpay</strong> to unlock
                exclusive content, unlimited AI queries, and advanced
                editorials.
              </p>
            </motion.div>

            {/* AI Feature */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-3xl group hover:border-purple-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Generative AI Tutor
              </h3>
              <p className="text-slate-400 text-sm">
                Powered by <strong>Gemini API</strong>. Get hints, logic
                explanations, and code reviews without spoilers.
              </p>
            </motion.div>

            {/* Video Feature */}
            <motion.div
              variants={itemVariants}
              className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                  <Globe size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Cloud-Native Media
                </h3>
                <p className="text-slate-400 max-w-md">
                  We use <strong>Cloudinary</strong> to deliver high-performance
                  video solutions. Watch step-by-step visual breakdowns of
                  complex algorithms.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 4: MEET THE TEAM (REIMAGINED) --- */}
      {/* --- SECTION 4: MEET THE ARCHITECT (IDE STYLE) --- */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* LEFT: PROFILE CARD */}
            {/* LEFT: PROFILE CARD */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/3 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* FIX 1: Add pointer-events-none so clicks pass through the gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-60 pointer-events-none" />

              <div className="relative w-36 h-36 mb-6">
                <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl"></div>
                <img
                  src="/pra.png"
                  alt="Prateek Thakur"
                  className="relative w-full h-full rounded-full object-cover border-4 border-slate-950"
                />
              </div>

              <h3 className="text-2xl font-bold text-white relative z-10">
                Prateek Thakur
              </h3>
              <p className="text-cyan-400 font-mono text-sm mb-6 relative z-10">
                &lt;FullStackDeveloper /&gt;
              </p>

              {/* SOCIAL LINKS */}
              {/* FIX 2: Add relative and z-10 to bring links above the background */}
              <div className="flex gap-3 relative z-10">
                <a
                  href="https://linkedin.com/in/prateek-thakurr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all hover:scale-110 cursor-pointer"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://github.com/prateekThakur84"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:bg-white hover:text-black transition-all hover:scale-110 cursor-pointer"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://prateekportfolio-eta.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:bg-cyan-500 hover:text-white transition-all hover:scale-110 cursor-pointer"
                >
                  <Globe size={20} />
                </a>
                <a
                  href="mailto:prateek08thakur@gmail.com"
                  className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:scale-110 cursor-pointer"
                >
                  <Mail size={20} />
                </a>
              </div>
            </motion.div>

            {/* RIGHT: CODE EDITOR */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-2/3 bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden shadow-2xl font-mono text-sm"
            >
              {/* Editor Header */}
              <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#333]">
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <span className="text-xs text-slate-400">
                  prateek_profile.json
                </span>
                <div className="w-10" />
              </div>

              {/* Code */}
              <div className="p-6 text-blue-300 overflow-x-auto">
                <div className="grid grid-cols-[auto_1fr] gap-4">
                  <div className="text-slate-600 text-right select-none space-y-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div>
                      <span className="text-purple-400">const</span>{" "}
                      <span className="text-yellow-300">architect</span> = {"{"}
                    </div>
                    <div className="pl-4">
                      <span className="text-sky-300">name</span>:{" "}
                      <span className="text-orange-300">"Prateek Thakur"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-sky-300">role</span>:{" "}
                      <span className="text-orange-300">
                        "Final Year CSE Student"
                      </span>
                      ,
                    </div>
                    <div className="pl-4">
                      <span className="text-sky-300">internship</span>:{" "}
                      <span className="text-orange-300">"Classio Labs "</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-sky-300">achievements</span>: [
                    </div>
                    <div className="pl-8">"Rank 139 – CodeChef"</div>
                    <div className="pl-8">"Top 1720 – CodeVita"</div>
                    <div className="pl-8">"SIH Internal Winner"</div>
                    <div className="pl-4">],</div>
                    <div className="pl-4">
                      <span className="text-sky-300">mission</span>:{" "}
                      <span className="text-orange-300">
                        "Build systems that actually help students."
                      </span>
                    </div>
                    <div>{"}"};</div>
                    <div className="text-slate-500 mt-2">
                      // Ready for production 🚀
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: FUTURE ROADMAP --- */}
      <section className="relative z-10 py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              The Future of DSA Buddy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "Company Specific Questions",
                "Aptitude Tests",
                "Resume Builder",
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 border border-slate-800 rounded-xl bg-slate-900/50 text-slate-300 text-sm font-medium flex items-center justify-center gap-2 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 6: FOOTER CTA --- */}
      <section className="py-24 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <h2 className="text-white text-3xl font-bold mb-6">
            Ready to crack your dream company?
          </h2>
          <p className="text-slate-400 mb-8">
            Join the platform built by a winner, for winners.
          </p>
          <div className="flex justify-center">
            <Link to="/signup">
              <button className="group flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg shadow-cyan-900/20 hover:scale-105 transition-transform hover:shadow-cyan-500/40">
                <TrendingUp size={20} />
                <span>Start Your Journey</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      <MadeWithLove />
    </div>
  );
};

export default AboutPage;
