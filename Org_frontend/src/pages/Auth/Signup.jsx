import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Chrome } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { registerUser, clearMessages } from "../../store/slices/authSlice";
import EmailVerification from "../../components/Auth/EmailVerification";

const signupSchema = z
  .object({
    firstName: z.string().min(3),
    lastName: z.string().optional(),
    emailId: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Floating code snippets
const FloatingCode = ({ children, className, delay }) => (
  <motion.div
    className={`absolute text-cyan-400/20 font-mono text-xs pointer-events-none ${className}`}
    animate={{ y: [0, -8, 0], opacity: [0.2, 0.4, 0.2] }}
    transition={{ repeat: Infinity, duration: 3, delay, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function Signup() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, success, needsEmailVerification } =
    useSelector((s) => s.auth);
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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-32 left-32 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        <FloatingCode className="top-20 left-12" delay={0}>
          for(let i=0;i&lt;n;i++)
        </FloatingCode>
        <FloatingCode className="top-32 right-16" delay={1}>
          if(dp[i]) dp[i]++;
        </FloatingCode>
        <FloatingCode className="bottom-40 left-20" delay={2}>
          map[x] = set.add(x)
        </FloatingCode>
        <FloatingCode className="bottom-20 right-12" delay={0.5}>
          return result;
        </FloatingCode>
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')]"
          style={{ opacity: 0.2 }}
        />
      </div>

      {/* Left Panel */}
      <motion.div
        className="hidden lg:flex w-1/2 p-12 flex-col justify-center space-y-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-cyan-400">
          Welcome to DSA Buddy
        </h1>
        <p className="text-gray-300 max-w-sm">
          Your all-in-one platform to master data structures & algorithms
          through interactive learning, contests, and real-world projects.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl text-yellow-400">🏆</span>
            <div>
              <h3 className="text-lg text-white">Weekly Contests</h3>
              <p className="text-sm text-gray-400">Compete and win prizes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl text-cyan-400">💡</span>
            <div>
              <h3 className="text-lg text-white">Interactive Challenges</h3>
              <p className="text-sm text-gray-400">Hands-on coding exercises</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl text-green-400">🎓</span>
            <div>
              <h3 className="text-lg text-white">Expert Tutorials</h3>
              <p className="text-sm text-gray-400">In-depth DSA guides</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.form
          className="w-full max-w-md bg-black/20 backdrop-blur-lg border border-cyan-400/20 rounded-2xl p-6 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white text-center">
            Create Account
          </h2>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-300">First Name *</label>
              <div className="relative">
                <User
                  className="absolute left-2 top-2 text-gray-400"
                  size={16}
                />
                <input
                  {...register("firstName")}
                  className={`pl-6 pr-2 py-2 w-full bg-black/40 border rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-400 ${
                    errors.firstName ? "border-red-500" : "border-cyan-400/30"
                  }`}
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-300">Last Name</label>
              <div className="relative">
                <User
                  className="absolute left-2 top-2 text-gray-400"
                  size={16}
                />
                <input
                  {...register("lastName")}
                  className="pl-6 pr-2 py-2 w-full bg-black/40 border border-cyan-400/30 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-400"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-300">Email *</label>
            <div className="relative">
              <Mail className="absolute left-2 top-2 text-gray-400" size={16} />
              <input
                {...register("emailId")}
                className={`pl-6 pr-2 py-2 w-full bg-black/40 border rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-400 ${
                  errors.emailId ? "border-red-500" : "border-cyan-400/30"
                }`}
                placeholder="john@example.com"
              />
            </div>
            {errors.emailId && (
              <p className="text-xs text-red-400 mt-1">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-300">Password *</label>
            <div className="relative">
              <Lock className="absolute left-2 top-2 text-gray-400" size={16} />
              <input
                {...register("password")}
                type={showPwd ? "text" : "password"}
                className={`pl-6 pr-8 py-2 w-full bg-black/40 border rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-400 ${
                  errors.password ? "border-red-500" : "border-cyan-400/30"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-2 top-2 text-gray-400"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs text-gray-300">Confirm Password *</label>
            <div className="relative">
              <Lock className="absolute left-2 top-2 text-gray-400" size={16} />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                className={`pl-6 pr-8 py-2 w-full bg-black/40 border rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-400 ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-cyan-400/30"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2 top-2 text-gray-400"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center py-2 border border-cyan-400/30 rounded-lg mt-2 hover:bg-white/10 transition-colors"
          >
            <FcGoogle size={20} className="mr-2" />
            Continue with Google
          </button>

          {/* Switch */}
          <p className="text-xs text-gray-400 text-center mt-3">
            Already have an account?{" "}
            <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300">
              Sign in →
            </NavLink>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default Signup;
