const express = require('express');
const aiRouter = express.Router();

const { authenticateUser } = require('../middleware/auth.middleware');
const { 
  checkAIChatLimit, 
  incrementFeatureUsage 
} = require('../middleware/usage.middleware');

const solveDoubt = require('../controllers/ai.controller');

// AI Chat Route with Usage Limit + Increment Logic
aiRouter.post(
  '/chat',
  authenticateUser,
  checkAIChatLimit, // ✅ Check if free user has chat quota left
  solveDoubt,       // 🧠 Controller logic (actual AI chat handler)
   // ✅ Increment usage count
);

module.exports = aiRouter;
