const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const redisClient = require('../config/redis.config');
const { sendErrorResponse } = require('../utils/response.util');

/**
 * Verify JWT token and check against Redis blacklist
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Decoded token payload
 */
const verifyToken = async (token) => {
  try {
    // Verify JWT
    const payload = jwt.verify(token, process.env.JWT_KEY);

    if (!payload._id) {
      throw new Error('Invalid token payload');
    }

    // Check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.exists(`token:${token}`);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }

    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Base authentication middleware
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Function} - Express middleware function
 */
const authenticate = (allowedRoles = ['user', 'admin']) => {
  return async (req, res, next) => {
    try {
      // ✅ UPDATED: Extract token from Authorization header first
      let token = null;
      
      // Check Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7); // Remove "Bearer " prefix
      }
      
      // ✅ OPTIONAL: Fallback to cookies for backward compatibility
      if (!token && req.cookies.token) {
        token = req.cookies.token;
      }

      if (!token) {
        return sendErrorResponse(res, 401, 'Authentication required');
      }

      // Verify token
      const payload = await verifyToken(token);

      // Find user in database
      const user = await User.findById(payload._id).select('-password');

      if (!user) {
        return sendErrorResponse(res, 401, 'User not found');
      }

      // Check if user's account is active
      if (!user.isActive) {
        return sendErrorResponse(res, 403, 'Account has been deactivated');
      }

      // Check role authorization
      if (!allowedRoles.includes(user.role)) {
        return sendErrorResponse(res, 403, 'Insufficient permissions');
      }

      // Attach user to request object
      req.user = user;
      req.result = user; // Keep for backward compatibility

      next();
    } catch (error) {
      return sendErrorResponse(res, 401, error.message || 'Authentication failed');
    }
  };
};

/**
 * User authentication middleware
 * Allows both users and admins
 */
const authenticateUser = authenticate(['user', 'admin']);

/**
 * Admin authentication middleware
 * Only allows admins
 */
const authenticateAdmin = authenticate(['admin']);

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    // Check Authorization header first
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
      const payload = await verifyToken(token);
      const user = await User.findById(payload._id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        req.result = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  optionalAuth,
  verifyToken
};
