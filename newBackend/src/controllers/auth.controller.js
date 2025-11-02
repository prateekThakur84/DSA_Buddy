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
    // Validate input data
    validate(req.body);
    
    const { firstName, lastName, emailId, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate email verification token
    const verificationToken = generateSecureToken();
    
    // Create user (unverified)
    const user = new User({
      firstName,
      lastName: lastName || '',
      emailId,
      password: hashedPassword,
      role: 'user',
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    
    await user.save();
    
    // Send verification email
    try {
      await sendVerificationEmail(emailId, firstName, verificationToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email sending fails
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

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required"
      });
    }
    
    // Find user with this verification token
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
    
    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    
    // Send welcome email
    try {
      await sendWelcomeEmail(user.emailId, user.firstName);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }
    
    // Create JWT token for automatic login
    const jwtToken = createJWTToken(user);
    
    // Set cookie
    res.cookie('token', jwtToken, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.json({
      success: true,
      message: "Email verified successfully! You are now logged in.",
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

// Resend verification email
const resendVerificationEmail = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }
    
    // Generate new verification token
    const verificationToken = generateSecureToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    
    // Send verification email
    await sendVerificationEmail(emailId, user.firstName, verificationToken);
    
    res.json({
      success: true,
      message: "Verification email sent successfully"
    });
    
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification email"
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    
    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    
    // Find user
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    // Check if user has a password (might be Google OAuth only user)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Please login using Google OAuth"
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        needsEmailVerification: true
      });
    }
    
    // Update last login
    user.lastLoginAt = new Date();
    await user.save();
    
    // Create JWT token
    const token = createJWTToken(user);
    
    // Set cookie
    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    res.json({
      success: true,
      message: "Login successful",
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

// Google OAuth success callback
const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;
    
    // Create JWT token
    const token = createJWTToken(user);
    
    // Set cookie
    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
    
  } catch (error) {
    console.error('Google auth success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`);
  }
};

// Forgot password
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
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: "If an account with that email exists, we've sent a password reset link"
      });
    }
    
    // Check if user has password (not Google OAuth only)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google OAuth. Please login with Google."
      });
    }
    
    // Generate reset token
    const resetToken = generateSecureToken();
    
    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();
    
    // Send password reset email
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

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required"
      });
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }
    
    // Find user with valid reset token
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
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password and clear reset token
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

// Check auth status
const checkAuth = async (req, res) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    
    // Verify JWT token
    const payload = jwt.verify(token, process.env.JWT_KEY);
    
    // Check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.exists(`token:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid"
      });
    }
    
    // Find user
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

// Logout
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    
    if (token) {
      // Add token to Redis blacklist
      const payload = jwt.decode(token);
      if (payload && payload.exp) {
        await redisClient.set(`token:${token}`, 'blacklisted');
        await redisClient.expireAt(`token:${token}`, payload.exp);
      }
    }
    
    // Clear cookie
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

// Get user profile
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

// Update user profile
const  updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;
    const userId = req.result._id;
    
    // Prepare update object
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

// Change password
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
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }
    
    // Hash new password
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

// Delete account
const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    // Clear cookie
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

// Admin register (keeping for backward compatibility)
const adminRegister = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    
    req.body.password = await bcrypt.hash(password, 12);
    req.body.role = 'admin';
    req.body.isEmailVerified = true; // Admin accounts are pre-verified
    
    const user = await User.create(req.body);
    
    const token = createJWTToken(user);
    
    res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 });
    res.status(201).json({
      success: true,
      message: "Admin registered successfully"
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