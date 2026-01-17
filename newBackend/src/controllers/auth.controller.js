const redisClient = require("../config/redis.config");
const User = require("../models/user.model");
const validate = require('../utils/validation.util');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email.util');

// Generate secure random token
const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create JWT token
const createJWTToken = (user) => {
  return jwt.sign(
    { 
      _id: user._id, 
      emailId: user.emailId, 
      role: user.role,
      isEmailVerified: user.isEmailVerified 
    },
    process.env.JWT_KEY,
    { expiresIn: '24h' }
  );
};

// Register user with email verification
const register = async (req, res) => {
  try {
    validate(req.body);
    
    const { firstName, lastName, emailId, password } = req.body;
    
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateSecureToken();
    
    const user = new User({
      firstName,
      lastName: lastName || '',
      emailId,
      password: hashedPassword,
      role: 'user',
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    await user.save();
    
    try {
      await sendVerificationEmail(emailId, firstName, verificationToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      data: {
        userId: user._id,
        emailId: user.emailId,
        firstName: user.firstName,
        isEmailVerified: user.isEmailVerified
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
};

// ✅ UPDATED: Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required"
      });
    }
    
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
    }
    
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    
    try {
      await sendWelcomeEmail(user.emailId, user.firstName);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }
    
    const jwtToken = createJWTToken(user);
    
    // ✅ REMOVED: Cookie setting
    // ✅ ADDED: Token in response
    res.json({
      success: true,
      message: "Email verified successfully! You are now logged in.",
      token: jwtToken, // ✅ Send token in response
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture
      }
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: "Email verification failed"
    });
  }
};

// Resend verification email (no changes needed)
const resendVerificationEmail = async (req, res) => {
  try {
    const { emailId } = req.body;
    
    console.log('📧 Resend verification request for:', emailId);
    
    if (!emailId) {
      return res.status(400).json({
        success: false,
        message: "Email address is required"
      });
    }
    
    const user = await User.findOne({ emailId });
    
    if (!user) {
      console.log('❌ User not found:', emailId);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (user.isEmailVerified) {
      console.log('⚠️ Email already verified:', emailId);
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }
    
    const verificationToken = generateSecureToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    try {
      await user.save();
      console.log('✅ Token saved for user:', emailId);
    } catch (saveError) {
      console.error('❌ Failed to save token:', saveError);
      throw new Error('Failed to save verification token');
    }
    
    try {
      await sendVerificationEmail(emailId, user.firstName, verificationToken);
      console.log('✅ Verification email sent to:', emailId);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
    }
    
    res.json({
      success: true,
      message: "Verification email sent successfully"
    });
  } catch (error) {
    console.error('❌ Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send verification email"
    });
  }
};

// ✅ UPDATED: Login
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    
    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Please login using Google OAuth"
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        needsEmailVerification: true
      });
    }
    
    user.lastLoginAt = new Date();
    await user.save();
    
    const token = createJWTToken(user);
    
    // ✅ REMOVED: Cookie setting
    // ✅ ADDED: Token in response
    res.json({
      success: true,
      message: "Login successful",
      token: token, // ✅ Send token in response
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

// ✅ UPDATED: Google OAuth success callback
const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;
    const token = createJWTToken(user);
    
    // ✅ UPDATED: Redirect with token in URL (frontend will handle storing it)
    res.redirect(`${process.env.FRONTEND_URL}/auth/google-callback?token=${token}`);
    
  } catch (error) {
    console.error('Google auth success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`);
  }
};

// Forgot password (no changes needed)
const forgotPassword = async (req, res) => {
  try {
    const { emailId } = req.body;
    
    if (!emailId) {
      return res.status(400).json({
        success: false,
        message: "Email address is required"
      });
    }
    
    const user = await User.findOne({ emailId });
    
    if (!user) {
      return res.json({
        success: true,
        message: "If an account with that email exists, we've sent a password reset link"
      });
    }
    
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google OAuth. Please login with Google."
      });
    }
    
    const resetToken = generateSecureToken();
    
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    
    await sendPasswordResetEmail(emailId, user.firstName, resetToken);
    
    res.json({
      success: true,
      message: "Password reset link sent to your email"
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request"
    });
  }
};

// Reset password (no changes needed)
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required"
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }
    
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: "Password reset successful. Please login with your new password."
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password"
    });
  }
};

// ✅ UPDATED: Check auth status
const checkAuth = async (req, res) => {
  try {
    // ✅ UPDATED: Read from Authorization header
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
    
    // Fallback to cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    
    const payload = jwt.verify(token, process.env.JWT_KEY);
    
    const isBlacklisted = await redisClient.exists(`token:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid"
      });
    }
    
    const user = await User.findById(payload._id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture
      }
    });
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    console.error('Check auth error:', error);
    res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

// ✅ UPDATED: Logout
const logout = async (req, res) => {
  try {
    // ✅ UPDATED: Get token from Authorization header
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
    
    // Fallback to cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (token) {
      const payload = jwt.decode(token);
      if (payload && payload.exp) {
        await redisClient.set(`token:${token}`, 'blacklisted');
        await redisClient.expireAt(`token:${token}`, payload.exp);
      }
    }
    
    // Clear cookie if exists
    res.cookie("token", null, { expires: new Date(Date.now()) });
    
    res.json({
      success: true,
      message: "Logged out successfully"
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

// Get user profile (no changes - already uses middleware)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.result._id)
      .select('-password -emailVerificationToken -passwordResetToken')
      .populate('problemSolved');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile"
    });
  }
};

// Update user profile (no changes - already uses middleware)
const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;
    const userId = req.result._id;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (age !== undefined) updateData.age = age;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
};

// Change password (no changes - already uses middleware)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.result._id;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }
    
    const user = await User.findById(userId);
    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Cannot change password for this account"
      });
    }
    
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    
    res.json({
      success: true,
      message: "Password changed successfully"
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to change password"
    });
  }
};

// Delete account (no changes - already uses middleware)
const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    
    await User.findByIdAndDelete(userId);
    
    res.cookie("token", null, { expires: new Date(Date.now()) });
    
    res.json({
      success: true,
      message: "Account deleted successfully"
    });
    
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account"
    });
  }
};

// ✅ UPDATED: Admin register
const adminRegister = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    
    req.body.password = await bcrypt.hash(password, 12);
    req.body.role = 'admin';
    req.body.isEmailVerified = true;
    
    const user = await User.create(req.body);
    
    const token = createJWTToken(user);
    
    // ✅ REMOVED: Cookie setting
    // ✅ ADDED: Token in response
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token: token // ✅ Send token in response
    });
    
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(400).json({
      success: false,
      message: error.message || "Admin registration failed"
    });
  }
};

module.exports = {
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
};
