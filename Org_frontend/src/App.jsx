import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router";
import { checkAuth } from "./store/slices/authSlice";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Route Guards
import PrivateRoute from "./components/common/PrivateRoute";
import AdminRoute from "./components/common/AdminRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import EmailVerification from "./components/Auth/EmailVerification";
import GoogleCallback from "./pages/Auth/GoogleCallback"; // ✅ ADDED

// Public Pages
import LandingPage from "./pages/Public/LandingPage";
import About from "./pages/Public/About";

// Main Pages
import Homepage from "./pages/Dashboard/Homepage";
import Problems from "./pages/Problems/Problems";
import ProblemPage from "./pages/Problems/ProblemPage";
import ContestsPage from "./pages/Contests/Contests";
import DiscussPage from "./pages/Discuss/Discuss";
import UserProfile from "./pages/Profile/UserProfile";

// Admin Pages
import AdminDashboard from "./pages/Admin/Admin";
import CreateProblem from "./pages/Admin/AdminPanel";
import DeleteProblem from "./pages/Admin/AdminDelete";
import ManageVideos from "./pages/Admin/AdminVideo";
import UploadSolution from "./pages/Admin/AdminVideo";
import PricingPage from "./pages/Pricing/PricingPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication on app mount
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/auth/google-callback" element={<GoogleCallback />} /> {/* ✅ ADDED */}
      </Route>

      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/price" element={<PricingPage />} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/problems"
          element={
            <PrivateRoute>
              <Problems />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/problem/:id"
          element={
            <PrivateRoute>
              <ProblemPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/contests"
          element={
            <PrivateRoute>
              <ContestsPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/discuss"
          element={
            <PrivateRoute>
              <DiscussPage />
            </PrivateRoute>
          }
        />
        
        
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/create"
          element={
            <AdminRoute>
              <CreateProblem />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/delete"
          element={
            <AdminRoute>
              <DeleteProblem />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/videos"
          element={
            <AdminRoute>
              <ManageVideos />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/upload"
          element={
            <AdminRoute>
              <UploadSolution />
            </AdminRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
