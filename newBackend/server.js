const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("./src/config/passport.config");
require("dotenv").config();

const connectDatabase = require("./src/config/database.config");
const redisClient = require("./src/config/redis.config");
const { PORT, FRONTEND_URL, NODE_ENV } = require("./src/config/constants");

const authRoutes = require("./src/routes/auth.routes");
const problemRoutes = require("./src/routes/problem.routes");
const submissionRoutes = require("./src/routes/submission.routes");
const aiRoutes = require("./src/routes/ai.routes");
const videoRoutes = require("./src/routes/video.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const { authenticateUser } = require("./src/middleware/auth.middleware");
const { checkVideoSolutionLimit } = require("./src/middleware/usage.middleware");
const usageRouter = require("./src/routes/usage.routes");

const app = express();

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// ✅ IMPORTANT: Raw body parser for Razorpay webhook signature verification
// This MUST come before express.json() for the webhook route
app.use('/payment/webhook', express.raw({type: 'application/json'}));

const allowedOrigins = [
  'https://dsa-buddy-frontend.onrender.com', // Frontend (Render)
  'http://localhost:5173',                   // Local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('❌ CORS blocked for origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Required if sending cookies or auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight requests
app.options('*', cors());


// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Debug middleware
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

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("⚠️  SIGTERM received, shutting down gracefully...");
  await redisClient.quit();
  process.exit(0);
});

startServer();

module.exports = app;
