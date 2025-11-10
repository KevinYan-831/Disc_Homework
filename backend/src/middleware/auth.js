const { supabase } = require('../config/supabase');

/**
 * Middleware to verify authentication token and attach user to request
 * Makes authentication optional - continues even if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // If no token, continue without user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      req.userId = null;
      return next();
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      // Token invalid, but continue without user
      req.user = null;
      req.userId = null;
      return next();
    }

    // Attach user info to request
    req.user = data.user;
    req.userId = data.user.id;
    
    next();
  } catch (error) {
    console.error('Error in optionalAuth middleware:', error);
    // Don't block request on auth errors
    req.user = null;
    req.userId = null;
    next();
  }
};

/**
 * Middleware to require authentication
 * Returns 401 if no valid token provided
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid token.'
      });
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Attach user info to request
    req.user = data.user;
    req.userId = data.user.id;
    
    next();
  } catch (error) {
    console.error('Error in requireAuth middleware:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error',
      details: error.message
    });
  }
};

/**
 * Middleware to extract user ID from custom header (legacy support)
 * Falls back to Bearer token authentication
 */
const extractUserId = async (req, res, next) => {
  try {
    // First try Bearer token
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data, error } = await supabase.auth.getUser(token);
      
      if (!error && data.user) {
        req.user = data.user;
        req.userId = data.user.id;
        return next();
      }
    }

    // Fall back to x-user-id header (for backward compatibility)
    const userId = req.headers['x-user-id'];
    
    if (userId) {
      req.userId = userId;
      req.user = { id: userId };
    } else {
      req.userId = null;
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Error in extractUserId middleware:', error);
    req.user = null;
    req.userId = null;
    next();
  }
};

module.exports = {
  optionalAuth,
  requireAuth,
  extractUserId
};
