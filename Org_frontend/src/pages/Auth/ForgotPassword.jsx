import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, Shield, Key, Lock, CheckCircle } from "lucide-react";

import { forgotPassword, clearMessages } from "../../store/slices/authSlice";

const forgotPasswordSchema = z.object({
  emailId: z.string().email("Invalid Email"),
});

// --- Shared Background Components ---
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

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setEmailSent(true);
    }
  }, [success]);

  const onSubmit = (data) => {
    dispatch(forgotPassword(data.emailId));
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-slate-950 via-[#0B1021] to-black relative overflow-hidden">
      
      {/* --- FULL SCREEN BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-64 -left-64 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <CircuitBackground />
        
        {/* Security Themed Code Snippets */}
        <FloatingCode className="text-cyan-400/30 left-[10%]" style={{ top: '80%' }} duration={15}>{'auth.verify(token);'}</FloatingCode>
        <FloatingCode className="text-blue-400/30 left-[60%]" style={{ top: '90%' }} duration={12} yOffset={-150}>{'if (reset_required) sendMail();'}</FloatingCode>
        <FloatingCode className="text-purple-400/30 left-[30%]" style={{ top: '70%' }} duration={18}>{'encryption: "AES-256"'}</FloatingCode>
        <FloatingCode className="text-cyan-400/20 right-[15%]" style={{ top: '60%' }} duration={20}>{'// Generating secure hash...'}</FloatingCode>
        <FloatingCode className="text-green-400/20 left-[5%]" style={{ top: '50%' }} duration={25}>{'HTTPS 200 OK'}</FloatingCode>
      </div>

      {/* --- LEFT PANEL (Compact Security Visualization) --- */}
      <motion.div
        className="hidden lg:flex w-1/2 flex-col justify-center items-center relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-72 h-72 flex items-center justify-center mb-6">
          
          {/* Glowing Core */}
          <div className="absolute z-10 flex flex-col items-center justify-center w-28 h-28 bg-[#0b0f19] border border-cyan-500/50 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.4)]">
             <Shield size={32} className="text-cyan-400 mb-1" />
             <span className="text-[10px] text-cyan-400/80 tracking-[0.2em] uppercase">Secure</span>
          </div>

          {/* Rings - Scaled Down */}
          <motion.div 
            className="absolute w-44 h-44 border border-cyan-500/30 rounded-full border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />
        </div>

        <div className="text-center space-y-2 max-w-sm">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Account <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Recovery</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Securely reset your password and regain access to your dashboard.
          </p>
        </div>
      </motion.div>


      {/* --- RIGHT PANEL (Compact Form) --- */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-full max-w-[400px] bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          {!emailSent ? (
            // --- FORM STATE ---
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
                <p className="text-gray-400 text-xs mt-1.5">Enter your email to receive reset instructions.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                    <input
                      {...register("emailId")}
                      className={`pl-10 pr-4 py-2 w-full bg-black/50 border rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                        errors.emailId ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-cyan-500"
                      }`}
                      placeholder="dsabuddy@example.com"
                    />
                  </div>
                  {errors.emailId && <p className="text-xs text-red-400 ml-1">{errors.emailId.message}</p>}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-xs text-red-400">
                    {typeof error === "string" ? error : "Failed to send reset email. Please try again."}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center mt-2"
                >
                  {loading ? (
                    <>Sending...</>
                  ) : (
                    <><Send size={16} className="mr-2" /> Send Instructions</>
                  )}
                </button>
              </form>
            </>
          ) : (
            // --- SUCCESS STATE ---
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                We've sent password reset instructions to <br/>
                <span className="text-cyan-400 font-medium">{getValues("emailId")}</span>
              </p>
              
              <button
                onClick={() => setEmailSent(false)}
                className="text-xs text-gray-500 hover:text-white transition-colors underline decoration-dotted"
              >
                Try a different email
              </button>
            </motion.div>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <NavLink to="/login" className="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              <ArrowLeft size={14} className="mr-2" /> Back to Login
            </NavLink>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;