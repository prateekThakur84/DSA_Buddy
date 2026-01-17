const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("./src/config/passport.config");
require("dotenv").config();

const connectDatabase = require("./src/config/database.config");
// const redisClient = require("./src/config/redis.config");
const { PORT, FRONTEND_URL, NODE_ENV } = require("./src/config/constants");

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

const app = express();

app.set("trust proxy", 1);

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// ✅ CRITICAL: CORS FIRST (before any body parsing)
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// ✅ CRITICAL FIX: Raw body parser for WEBHOOK MUST come BEFORE express.json()
// ✅ This captures the raw body for signature verification
app.use("/payment/webhook", express.raw({ type: "application/json" }));

// ✅ CRITICAL: Body parser for all OTHER routes (after webhook middleware)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration (ONLY for Google OAuth)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your-session-secret-here",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000,
//       secure: NODE_ENV === "production",
//       httpOnly: true,
//       sameSite: "lax",
//     },
//   })
// );

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,       // Required for Vercel (HTTPS)
    sameSite: 'none',   // Required for Netlify frontend to speak to Vercel backend
    maxAge: 1000 * 60 * 60 * 24 
  }
}));
// Initialize Passport middleware (for Google OAuth)
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware
app.use((req, res, next) => {
  // ✅ Log webhook body for debugging
  if (req.path === "/payment/webhook") {
    console.log("🔔 Webhook DEBUG:");
    console.log("  Body type:", typeof req.body);
    console.log("  Body is Buffer:", Buffer.isBuffer(req.body));
    console.log("  Body length:", req.body?.length || "N/A");
    console.log(
      "  Body preview:",
      Buffer.isBuffer(req.body)
        ? req.body.toString("utf8").substring(0, 100)
        : JSON.stringify(req.body).substring(0, 100)
    );
  }

  console.log("🔍 Request:", {
    path: req.path,
    method: req.method,
    authorization: req.headers.authorization ? "Present" : "Missing",
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
app.use("/api/usage", authenticateUser, checkVideoSolutionLimit, usageRouter);

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

// , redisClient.connect()

const startServer = async () => {
  try {
    await Promise.all([connectDatabase()]);

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

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

// process.on("SIGTERM", async () => {
//   console.log("⚠️  SIGTERM received, shutting down gracefully...");
//   await redisClient.quit();
//   process.exit(0);
// });

startServer();

module.exports = app;
