import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";

import { forgotPassword, clearMessages } from "../../store/slices/authSlice";

const forgotPasswordSchema = z.object({
  emailId: z.string().email("Invalid Email"),
});

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (emailSent) {
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl">
                <Send className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Check your email
            </h2>
            <p className="text-gray-300">
              We've sent password reset instructions to
            </p>
          </motion.div>

          <motion.div
            className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-8 shadow-xl text-center"
            variants={itemVariants}
          >
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-full mb-4">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-lg font-semibold text-cyan-400 mb-2">
                {getValues("emailId")}
              </p>
              <p className="text-gray-300 text-sm">
                If an account with this email exists, you'll receive password
                reset instructions shortly.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <motion.button
                onClick={() => setEmailSent(false)}
                className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try a different email address
              </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-cyan-400/10">
              <NavLink
                to="/login"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </NavLink>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Forgot your password?
          </h2>
          <p className="text-gray-300">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </motion.div>

        <motion.div
          className="bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-xl p-8 shadow-xl"
          variants={itemVariants}
        >
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="emailId"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("emailId")}
                  type="email"
                  id="emailId"
                  autoComplete="email"
                  className={`w-full pl-10 pr-3 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 ${
                    errors.emailId ? "border-red-500" : "border-cyan-400/30"
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.emailId && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400"
                >
                  {errors.emailId.message}
                </motion.p>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-sm text-red-400 text-center">
                  {typeof error === "string"
                    ? error
                    : "Failed to send reset email. Please try again."}
                </p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Send reset instructions
                </div>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-cyan-400/10">
            <NavLink
              to="/login"
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </NavLink>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
