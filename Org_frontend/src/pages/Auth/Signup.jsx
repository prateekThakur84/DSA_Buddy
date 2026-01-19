import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Terminal, Cpu, Trophy, Database, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { registerUser, clearMessages } from "../../store/slices/authSlice";
import EmailVerification from "../../components/Auth/EmailVerification";

const signupSchema = z
  .object({
    firstName: z.string().min(3, "Min 3 chars"),
    lastName: z.string().optional(),
    emailId: z.string().email("Invalid email"),
    password: z.string().min(8, "Min 8 chars"),
    confirmPassword: z.string().min(8, "Min 8 chars"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// --- Background Components ---
const FloatingCode = ({ children, className, style, duration = 10, yOffset = -100 }) => (
  <motion.div
    className={`absolute font-mono text-xs pointer-events-none whitespace-nowrap ${className}`}
    style={style}
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: yOffset, opacity: [0, 0.4, 0] }}
    transition={{ repeat: Infinity, duration: duration, ease: "linear" }}
  >
    {children}
  </motion.div>
);

const CircuitBackground = () => (
  <div className="absolute inset-0 pointer-events-none">
    <svg className="absolute w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
      <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle fill="#22d3ee" cx="10" cy="10" r="1.5"/> <circle fill="#22d3ee" cx="90" cy="90" r="1.5"/>
        <circle fill="#3b82f6" cx="90" cy="10" r="1.5"/> <circle fill="#3b82f6" cx="10" cy="90" r="1.5"/>
        <path d="M10 10 L90 10 L90 90 L10 90 Z" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="4 4"/>
        <path d="M10 10 L10 90 M90 10 L90 90" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)">
         <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -100" dur="60s" repeatCount="indefinite"/>
      </rect>
    </svg>
  </div>
);

function Signup() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, needsEmailVerification } = useSelector((s) => s.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    dispatch(clearMessages());
  }, [isAuthenticated]);

  const onSubmit = (data) => dispatch(registerUser(data));
  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  if (needsEmailVerification) return <EmailVerification />;

  return (
    // Changed min-h-screen to h-screen to force it to fit the window exactly
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-[#0B1021] to-black relative overflow-hidden font-sans">
      
      {/* --- FULL SCREEN IMMERSIVE BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-64 -left-64 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <CircuitBackground />
        
        <FloatingCode className="text-cyan-400/30 left-[10%]" style={{ top: '80%' }} duration={15}>{'for(let i=0; i<n; i++)'}</FloatingCode>
        <FloatingCode className="text-blue-400/30 left-[60%]" style={{ top: '90%' }} duration={12} yOffset={-150}>{'if(dp[i]) dp[i]++;'}</FloatingCode>
        <FloatingCode className="text-purple-400/30 left-[30%]" style={{ top: '70%' }} duration={18}>{'import { useState } from "react";'}</FloatingCode>
        <FloatingCode className="text-cyan-400/20 right-[15%]" style={{ top: '60%' }} duration={20}>{'// Initializing...'}</FloatingCode>
      </div>


      {/* --- LEFT PANEL (Reduced graphics size) --- */}
      <motion.div
        className="hidden lg:flex w-1/2 flex-col justify-center items-center relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Reduced size from w-96 h-96 to w-72 h-72 */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-6">
          
          {/* Core Reduced */}
          <div className="absolute z-10 flex flex-col items-center justify-center w-28 h-28 bg-[#0b0f19] border border-cyan-500/50 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.5)]">
             <Sparkles size={24} className="text-cyan-400 mb-1" />
             <span className="text-[10px] text-cyan-400/80 tracking-[0.2em] uppercase">Join Us</span>
          </div>

          {/* Inner Ring Reduced */}
          <motion.div 
            className="absolute w-44 h-44 border border-cyan-500/30 rounded-full border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Outer Ring Reduced */}
          <motion.div 
            className="absolute w-64 h-64 border border-slate-700/60 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
             {/* Icons positioned closer */}
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0b0f19] border border-slate-700 p-2 rounded-xl shadow-lg text-cyan-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}><Terminal size={18} /></motion.div>
             </div>
             <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-[#0b0f19] border border-slate-700 p-2 rounded-xl shadow-lg text-blue-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}><Database size={18} /></motion.div>
             </div>
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#0b0f19] border border-slate-700 p-2 rounded-xl shadow-lg text-purple-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}><Cpu size={18} /></motion.div>
             </div>
             <div className="absolute top-1/2 -left-4 -translate-y-1/2 bg-[#0b0f19] border border-slate-700 p-2 rounded-xl shadow-lg text-yellow-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}><Trophy size={18} /></motion.div>
             </div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />
        </div>

        <div className="text-center space-y-2 max-w-lg">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Start Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Legacy</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            Access premium contests, track progress, and get expert solutions.
          </p>
        </div>
      </motion.div>


      {/* --- RIGHT PANEL (Compact Form) --- */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.form
          // Reduced padding (p-8 -> p-6), added max-h to ensure it fits small screens
          className="w-full max-w-sm bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3 shadow-2xl relative"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          {/* Header Compacted */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 text-xs mt-1">Join DSA Buddy today.</p>
          </div>

          {/* Name Fields Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1">First Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                <input
                  {...register("firstName")}
                  // Reduced padding: py-2.5 -> py-2
                  className={`pl-9 pr-3 py-2 w-full bg-black/50 border rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                    errors.firstName ? "border-red-500/50" : "border-white/10 focus:border-cyan-500"
                  }`}
                  placeholder="Prateek"
                />
              </div>
              {errors.firstName && <p className="text-[10px] text-red-400 ml-1">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1">Last Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                <input
                  {...register("lastName")}
                  className="pl-9 pr-3 py-2 w-full bg-black/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  placeholder="Thakur"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input
                {...register("emailId")}
                className={`pl-9 pr-4 py-2 w-full bg-black/50 border rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                  errors.emailId ? "border-red-500/50" : "border-white/10 focus:border-cyan-500"
                }`}
                placeholder="dsabuddy@example.com"
              />
            </div>
            {errors.emailId && <p className="text-[10px] text-red-400 ml-1">{errors.emailId.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input
                {...register("password")}
                type={showPwd ? "text" : "password"}
                className={`pl-9 pr-9 py-2 w-full bg-black/50 border rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                  errors.password ? "border-red-500/50" : "border-white/10 focus:border-cyan-500"
                }`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-400 ml-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 ml-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                className={`pl-9 pr-9 py-2 w-full bg-black/50 border rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                  errors.confirmPassword ? "border-red-500/50" : "border-white/10 focus:border-cyan-500"
                }`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-red-400 ml-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#0b0f19] px-2 text-gray-500">Or continue with</span></div>
          </div>

          <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-200 transition-all">
            <FcGoogle size={18} className="mr-2" /> Google
          </button>

          <p className="text-xs text-gray-400 text-center mt-2">
            Already have an account? <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</NavLink>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default Signup;