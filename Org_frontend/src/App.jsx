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

// Public Pages
import LandingPage from "./pages/Public/LandingPage";
import About from "./pages/Public/About";

// Main Pages
import Homepage from "./pages/Dashboard/Homepage";
import ProblemsPage from "./pages/Problems/Problems";
import ProblemDetailPage from "./pages/Problems/ProblemPage";
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
      </Route>

      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route
          path="/problems"
          element={<PrivateRoute Component={ProblemsPage} />}
        />
        <Route
          path="/problem/:problemId"
          element={<PrivateRoute Component={ProblemDetailPage} />}
        />
        <Route
          path="/contests"
          element={<PrivateRoute Component={ContestsPage} />}
        />
        <Route
          path="/discuss"
          element={<PrivateRoute Component={DiscussPage} />}
        />
        <Route
          path="/price"
          element={<PrivateRoute Component={PricingPage} />}
        />
        <Route path="/about" element={<PrivateRoute Component={About} />} />
        <Route
          path="/profile"
          element={<PrivateRoute Component={UserProfile} />}
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={<AdminRoute Component={AdminDashboard} />}
        />
        <Route
          path="/admin/create"
          element={<AdminRoute Component={CreateProblem} />}
        />
        <Route
          path="/admin/delete"
          element={<AdminRoute Component={DeleteProblem} />}
        />
        <Route
          path="/admin/video"
          element={<AdminRoute Component={ManageVideos} />}
        />
        <Route
          path="/admin/upload/:problemId"
          element={<AdminRoute Component={UploadSolution} />}
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
