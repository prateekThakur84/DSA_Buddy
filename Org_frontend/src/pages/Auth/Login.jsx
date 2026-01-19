import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Terminal, Cpu, Trophy, Database } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { loginUser, clearMessages } from "../../store/slices/authSlice";
import EmailVerification from "../../components/Auth/EmailVerification";

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(1, "Password is required"),
});

// --- Background Component: Floating Code Snippets ---
// Expanded to handle custom duration, styles, and movement for the full background effect
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

// --- Background Component: Moving Circuit Pattern ---
// Adds a subtle, high-tech texture to the entire screen
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

function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, needsEmailVerification } =
    useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  useEffect(() => {
    dispatch(clearMessages());
    const authStatus = searchParams.get("auth");
    if (authStatus === "success") window.location.href = "/";
    else if (authStatus === "error")
      dispatch({
        type: "auth/login/rejected",
        payload: "Google authentication failed",
      });
  }, [dispatch, searchParams]);

  const onSubmit = (data) => dispatch(loginUser(data));
  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  if (needsEmailVerification) return <EmailVerification />;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-[#0B1021] to-black relative overflow-hidden">
      
      {/* --- FULL SCREEN IMMERSIVE BACKGROUND START --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 1. Large Glowing Orbs for Depth */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-64 -left-64 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        {/* 2. Circuit Pattern Overlay */}
        <CircuitBackground />

        {/* 3. Dynamic Matrix Code Rain */}
        <FloatingCode className="text-cyan-400/30 left-[10%]" style={{ top: '80%' }} duration={15}>{'const future = await build();'}</FloatingCode>
        <FloatingCode className="text-blue-400/30 left-[60%]" style={{ top: '90%' }} duration={12} yOffset={-150}>{'git commit -m "Success"'}</FloatingCode>
        <FloatingCode className="text-purple-400/30 left-[30%]" style={{ top: '70%' }} duration={18}>{'while(alive) { code(); }'}</FloatingCode>
        <FloatingCode className="text-cyan-400/20 right-[15%]" style={{ top: '60%' }} duration={20}>{'// Optimizing runtime...'}</FloatingCode>
        <FloatingCode className="text-blue-400/20 right-[40%]" style={{ top: '85%' }} duration={14} yOffset={-120}>{'return new Developer();'}</FloatingCode>
        <FloatingCode className="text-green-400/20 left-[5%]" style={{ top: '50%' }} duration={25}>{'<DSA_Buddy_App />'}</FloatingCode>
      </div>
      {/* --- FULL SCREEN IMMERSIVE BACKGROUND END --- */}


      {/* --- LEFT PANEL START (With Rotating Rings) --- */}
      <motion.div
        className="hidden lg:flex w-1/2  flex-col justify-center items-center relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Central Animated Composition */}
        <div className="relative w-96 h-96 flex items-center justify-center mb-4">
          
          {/* 1. The Glowing Core */}
          <div className="absolute z-10 flex flex-col items-center justify-center w-36 h-36 bg-[#0b0f19] border border-cyan-500/50 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.5)]">
             <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DSA</span>
             <span className="text-xs text-cyan-400/80 tracking-[0.2em] uppercase mt-1">Buddy</span>
          </div>

          {/* 2. Inner Orbit Ring (Fast) */}
          <motion.div 
            className="absolute w-56 h-56 border border-cyan-500/30 rounded-full border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* 3. Outer Orbit Ring (Slow) with Floating Icons */}
          <motion.div 
            className="absolute w-80 h-80 border border-slate-700/60 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          >
             {/* Floating Icon 1: Code */}
             <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0b0f19] border border-slate-700 p-3 rounded-xl shadow-lg text-cyan-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
                  <Terminal size={24} />
                </motion.div>
             </div>

             {/* Floating Icon 2: Database */}
             <div className="absolute top-1/2 -right-5 -translate-y-1/2 bg-[#0b0f19] border border-slate-700 p-3 rounded-xl shadow-lg text-blue-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
                  <Database size={24} />
                </motion.div>
             </div>

             {/* Floating Icon 3: CPU/Algo */}
             <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#0b0f19] border border-slate-700 p-3 rounded-xl shadow-lg text-purple-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
                  <Cpu size={24} />
                </motion.div>
             </div>

             {/* Floating Icon 4: Trophy */}
             <div className="absolute top-1/2 -left-5 -translate-y-1/2 bg-[#0b0f19] border border-slate-700 p-3 rounded-xl shadow-lg text-yellow-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
                  <Trophy size={24} />
                </motion.div>
             </div>
          </motion.div>

          {/* Central Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2 max-w-lg">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Level Up Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Development Journey</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Join a community of developers. Solve problems, complete challenges, and build your dream career.
          </p>
        </div>
      </motion.div>
      {/* --- LEFT PANEL END --- */}


      {/* --- RIGHT PANEL START (Login Form) --- */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.form
          className="w-full max-w-md bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl relative"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Subtle Form Top Glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Sign In</h2>
            <p className="text-gray-400 text-sm">Welcome back! Please enter your details.</p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input
                {...register("emailId")}
                className={`pl-10 pr-4 py-2.5 w-full bg-black/50 border rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                  errors.emailId ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-cyan-500"
                }`}
                placeholder="dsabuddy@example.com"
              />
            </div>
            {errors.emailId && <p className="text-xs text-red-400 ml-1">{errors.emailId.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-medium text-gray-300">Password</label>
              <NavLink to="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</NavLink>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input
                {...register("password")}
                type={showPwd ? "text" : "password"}
                className={`pl-10 pr-10 py-2.5 w-full bg-black/50 border rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                  errors.password ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-cyan-500"
                }`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password.message}</p>}
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-xs text-red-400">
              {typeof error === "string" ? error : "Login failed. Try again."}
            </motion.div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0b0f19] px-2 text-gray-500">Or continue with</span></div>
          </div>

          {/* Google */}
          <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-200 transition-all">
            <FcGoogle size={20} className="mr-2" /> Google
          </button>

          {/* Switch */}
          <p className="text-xs text-gray-400 text-center">Don't have an account? <NavLink to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign up</NavLink></p>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default Login;