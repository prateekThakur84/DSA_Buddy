const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("./src/config/passport.config");
require("dotenv").config();

// Import configurations
const connectDatabase = require("./src/config/database.config");
const redisClient = require("./src/config/redis.config");
const { PORT, FRONTEND_URL, NODE_ENV } = require("./src/config/constants");

// Import individual routes
const authRoutes = require("./src/routes/auth.routes");
const problemRoutes = require("./src/routes/problem.routes");
const submissionRoutes = require("./src/routes/submission.routes");
const aiRoutes = require("./src/routes/ai.routes");
const videoRoutes = require("./src/routes/video.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const { authenticateUser } = require("./src/middleware/auth.middleware");
const {
  checkVideoSolutionLimit,
} = require("./src/middleware/usage.middleware");
const usageRouter = require("./src/routes/usage.routes");

// Initialize Express app
const app = express();

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// ✅ UPDATED: Simplified CORS (no credentials needed for localStorage auth)
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Added Authorization header
    optionsSuccessStatus: 200
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Keep for Google OAuth session

// Session configuration (ONLY for Google OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Initialize Passport middleware (for Google OAuth)
app.use(passport.initialize());
app.use(passport.session());

// ✅ ADDED: Debug middleware (optional - remove in production)
app.use((req, res, next) => {
  console.log('🔍 Request:', {
    path: req.path,
    method: req.method,
    authorization: req.headers.authorization ? 'Present' : 'Missing'
  });
  next();
});

// ========================================
// ROUTES
// ========================================

app.use("/auth", authRoutes);
app.use("/problem", problemRoutes);
app.use("/submission", submissionRoutes);
app.use("/ai", aiRoutes);
app.use("/video", videoRoutes);
app.use("/payment", paymentRoutes);
app.use(
  "/api/usage",
  authenticateUser,
  checkVideoSolutionLimit,
  usageRouter
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ========================================
// SERVER INITIALIZATION
// ========================================

const startServer = async () => {
  try {
    await Promise.all([connectDatabase(), redisClient.connect()]);

    console.log("✅ Database and Redis connected successfully");

    app.listen(PORT, () => {
      console.log("========================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Frontend URL: ${FRONTEND_URL}`);
      console.log(`🔧 Environment: ${NODE_ENV}`);
      console.log("========================================");
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("⚠️  SIGTERM received, shutting down gracefully...");
  await redisClient.quit();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
