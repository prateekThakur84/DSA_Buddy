const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  googleAuthSuccess,
  forgotPassword,
  resetPassword,
  checkAuth,
  logout,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteProfile,
  adminRegister
} = require('../controllers/auth.controller');

// const {authenticateUser} = require('../middleware/auth.middleware');
const {authenticateUser} = require('../middleware/auth.middleware');
const {authenticateAdmin} = require('../middleware/auth.middleware');

// Regular authentication routes
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', checkAuth);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  googleAuthSuccess
);

// Protected routes (require authentication)
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.post('/change-password', authenticateUser, changePassword);
router.delete('/profile', authenticateUser, deleteProfile);

// Admin routes
router.post('/admin/register', authenticateAdmin, adminRegister);

module.exports = router;