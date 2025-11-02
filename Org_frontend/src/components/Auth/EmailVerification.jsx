import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router';
import { 
  Mail, 
  CheckCircle, 
  RefreshCw, 
  AlertCircle,
  Send,
  Clock,
  ArrowLeft,
  Home
} from 'lucide-react';
import { verifyEmail, resendVerificationEmail, clearMessages } from '../../store/slices/authSlice';

const EmailVerification = ({ email }) => {
  const [searchParams] = useSearchParams();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, success, isAuthenticated } = useSelector((state) => state.auth);

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

      // Using Redux action instead of direct API call
      await dispatch(resendVerificationEmail(email));

      setResendSuccess(true);
      setCountdown(60); // 60 second cooldown
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isAuthenticated ? (
          // Success State - Email Verified
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                🎉 Email Verified!
              </h2>
              <p className="text-gray-300 mb-6">
                Your email has been successfully verified. You're being redirected to your dashboard...
              </p>
            </motion.div>

            <div className="bg-black/20 backdrop-blur-lg border border-green-400/20 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
              </div>
              <p className="text-green-400 text-sm">Redirecting to dashboard...</p>
            </div>

            <motion.button
              onClick={() => navigate('/')}
              className="mt-6 flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-green-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard Now
            </motion.button>
          </div>
        ) : (
          // Verification Pending State
          <>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl">
                  <Mail className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Verify your email
              </h2>
              <p className="text-gray-300">
                We've sent a verification link to your email address
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-lg font-semibold text-cyan-400 mb-2">
                  {userEmail || 'your email address'}
                </p>
                <p className="text-gray-300 text-sm">
                  Please check your inbox and click the verification link to activate your account.
                </p>
              </div>

              {/* Status Messages */}
              {(error || loading) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">
                      {loading ? 'Verifying your email...' : error}
                    </p>
                  </div>
                </motion.div>
              )}

              {(success || resendSuccess) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-green-400 text-sm">
                      {success || 'Verification email sent successfully!'}
                    </p>
                  </div>
                </motion.div>
              )}

              {resendError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{resendError}</p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-sm text-gray-300 font-medium mb-2">What to do next:</p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Click the verification link in your email</li>
                    <li>• Check your spam folder if you don't see it</li>
                    <li>• The link expires in 24 hours</li>
                  </ul>
                </div>
                
                <motion.button
                  onClick={handleResendEmail}
                  disabled={resendLoading || loading || countdown > 0 || !userEmail}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20"
                  whileHover={{ scale: countdown > 0 || !userEmail ? 1 : 1.02 }}
                  whileTap={{ scale: countdown > 0 || !userEmail ? 1 : 0.98 }}
                >
                  {resendLoading || loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      {loading ? 'Verifying...' : 'Sending...'}
                    </div>
                  ) : countdown > 0 ? (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Resend in {formatTime(countdown)}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend verification email
                    </div>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center items-center py-3 px-4 border border-cyan-400/30 rounded-lg text-sm font-medium text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </motion.button>
              </div>

              <div className="mt-8 pt-6 border-t border-cyan-400/10 text-center">
                <p className="text-sm text-gray-400">
                  Having trouble? Contact support at{' '}
                  <a 
                    href="mailto:support@dsabuddy.com" 
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    support@dsabuddy.com
                  </a>
                </p>
              </div>
            </div>
          </>
        )}

        {!isAuthenticated && (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Once verified, you'll be automatically redirected to your dashboard.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmailVerification;