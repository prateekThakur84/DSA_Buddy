import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { loginUser, clearMessages } from "../../store/slices/authSlice";
import EmailVerification from "../../components/Auth/EmailVerification";

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(1, "Password is required"),
});

const FloatingCode = ({ children, className, delay }) => (
  <motion.div
    className={`absolute text-cyan-400/20 font-mono text-xs pointer-events-none ${className}`}
    animate={{ y: [0, -8, 0], opacity: [0.2, 0.4, 0.2] }}
    transition={{ repeat: Infinity, duration: 3, delay, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-32 left-32 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        <FloatingCode className="top-20 left-12" delay={0}>
          if(tree) traverse(tree);
        </FloatingCode>
        <FloatingCode className="top-32 right-16" delay={1}>
          map.get(key)?.push(val);
        </FloatingCode>
        <FloatingCode className="bottom-40 left-20" delay={2}>
          while(stack.length){}
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
        <h1 className="text-4xl font-bold text-cyan-400">Welcome Back!</h1>
        <p className="text-gray-300 max-w-sm">
          Sign in to continue solving problems, competing in contests, and
          mastering DSA.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl text-yellow-400">🏆</span>
            <div>
              <h3 className="text-lg text-white">Ongoing Contests</h3>
              <p className="text-sm text-gray-400">Join live coding battles</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl text-cyan-400">📈</span>
            <div>
              <h3 className="text-lg text-white">Track Progress</h3>
              <p className="text-sm text-gray-400">
                Personalized stats dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl text-green-400">💡</span>
            <div>
              <h3 className="text-lg text-white">Expert Solutions</h3>
              <p className="text-sm text-gray-400">
                In-depth problem explanations
              </p>
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
          <h2 className="text-2xl font-bold text-white text-center">Sign In</h2>

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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-300">Password *</label>
              <NavLink
                to="/forgot-password"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Forgot?
              </NavLink>
            </div>
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

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center text-xs text-red-400"
            >
              {typeof error === "string" ? error : "Login failed. Try again."}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            {loading ? "Signing in..." : "Sign In"}
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
            No account?{" "}
            <NavLink to="/signup" className="text-cyan-400 hover:text-cyan-300">
              Sign up →
            </NavLink>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default Login;
