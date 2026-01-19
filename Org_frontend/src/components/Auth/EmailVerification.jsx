import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router';
import { 
  Mail, 
  CheckCircle, 
  RefreshCw, 
  AlertCircle,
  Clock,
  ArrowLeft,
  Home,
  ShieldCheck
} from 'lucide-react';
import { verifyEmail, resendVerificationEmail, clearMessages } from '../../store/slices/authSlice';

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

const EmailVerification = ({ email }) => {
  const [searchParams] = useSearchParams();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Auto-verify if token is in URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [searchParams, dispatch]);

  // Redirect to homepage after successful verification
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => navigate('/'), 2000);
    }
  }, [isAuthenticated, navigate]);

  // Clear messages on mount
  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    if (countdown > 0 || !email) return;
    
    try {
      setResendLoading(true);
      setResendError('');
      setResendSuccess(false);

      await dispatch(resendVerificationEmail(email));

      setResendSuccess(true);
      setCountdown(60); 
      
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error) {
      setResendError('Failed to resend verification email');
      setTimeout(() => setResendError(''), 5000);
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const userEmail = email || user?.email;

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-slate-950 via-[#0B1021] to-black relative overflow-hidden items-center justify-center p-4">
      
      {/* --- FULL SCREEN BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-64 -left-64 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <CircuitBackground />
        
        {/* Verification Context Code Snippets */}
        <FloatingCode className="text-green-400/30 left-[10%]" style={{ top: '80%' }} duration={15}>{'user.isVerified = true;'}</FloatingCode>
        <FloatingCode className="text-cyan-400/30 left-[60%]" style={{ top: '90%' }} duration={12} yOffset={-150}>{'await sendVerification(token);'}</FloatingCode>
        <FloatingCode className="text-purple-400/30 left-[30%]" style={{ top: '70%' }} duration={18}>{'if (status === 200) redirect();'}</FloatingCode>
        <FloatingCode className="text-blue-400/20 right-[15%]" style={{ top: '60%' }} duration={20}>{'// Checking inbox...'}</FloatingCode>
      </div>

      <motion.div
        className="max-w-[400px] w-full relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* Top Border Glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          {isAuthenticated ? (
             // --- SUCCESS STATE ---
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30"
              >
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                Your account has been successfully verified. <br/>
                We are redirecting you to the dashboard.
              </p>

              <div className="flex flex-col items-center justify-center space-y-3">
                 <div className="flex items-center space-x-2 text-green-400 text-xs font-mono">
                    <div className="w-3 h-3 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                    <span>Redirecting...</span>
                 </div>
                 
                 <motion.button
                   onClick={() => navigate('/')}
                   className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-green-500/20 flex items-center justify-center"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   <Home className="w-4 h-4 mr-2" /> Go to Dashboard
                 </motion.button>
              </div>
            </div>
          ) : (
            // --- PENDING / VERIFY STATE ---
            <div className="text-center">
              <div className="flex justify-center mb-6">
                 <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <Mail className="w-8 h-8 text-cyan-400" />
                 </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
              <p className="text-gray-400 text-xs mb-6">
                We've sent a verification link to <br/>
                <span className="text-cyan-400 font-medium">{userEmail || 'your email address'}</span>
              </p>

              {/* Status Messages Box */}
              {(error || loading || resendSuccess || resendError) && (
                 <div className="mb-6">
                    {loading && (
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center space-x-2">
                             <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                             <span className="text-cyan-400 text-xs">Verifying token...</span>
                        </div>
                    )}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center space-x-2">
                             <AlertCircle className="w-4 h-4 text-red-400" />
                             <span className="text-red-400 text-xs">{error}</span>
                        </div>
                    )}
                    {resendSuccess && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center space-x-2">
                             <CheckCircle className="w-4 h-4 text-green-400" />
                             <span className="text-green-400 text-xs">Email sent successfully!</span>
                        </div>
                    )}
                     {resendError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center space-x-2">
                             <AlertCircle className="w-4 h-4 text-red-400" />
                             <span className="text-red-400 text-xs">{resendError}</span>
                        </div>
                    )}
                 </div>
              )}

              <div className="space-y-3">
                <motion.button
                  onClick={handleResendEmail}
                  disabled={resendLoading || loading || countdown > 0 || !userEmail}
                  className="w-full flex justify-center items-center py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
                  whileHover={{ scale: countdown > 0 ? 1 : 1.02 }}
                  whileTap={{ scale: countdown > 0 ? 1 : 0.98 }}
                >
                  {resendLoading ? (
                    <div className="flex items-center">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                       Sending...
                    </div>
                  ) : countdown > 0 ? (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Resend in {formatTime(countdown)}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend Email
                    </div>
                  )}
                </motion.button>
                
                <p className="text-[10px] text-gray-500 text-center px-4">
                    The link expires in 24 hours. Check your spam folder if you don't see it.
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                 <button 
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                 >
                    <ArrowLeft size={14} className="mr-2" /> Back to Login
                 </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Link */}
        <div className="text-center mt-6">
            <p className="text-[10px] text-gray-500">
               Need help? <a href="mailto:support@dsabuddy.com" className="text-gray-400 hover:text-white transition-colors">Contact Support</a>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;