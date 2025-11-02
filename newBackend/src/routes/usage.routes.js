const express = require("express");
const usageRouter = express.Router();
const { authenticateUser } = require("../middleware/auth.middleware");
const {
  trackVideoView,
  trackEditorialAccess,
} = require("../controllers/usage.controller");

// Track video solution views
usageRouter.post("/track/video/:problemId", authenticateUser, trackVideoView);

// Track editorial access
usageRouter.post(
  "/track/editorial/:problemId",
  authenticateUser,
  trackEditorialAccess
);

module.exports = usageRouter;
