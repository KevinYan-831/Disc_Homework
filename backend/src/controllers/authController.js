const { supabase } = require('../config/supabase');

/**
 * Sign up a new user
 */
const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      data: {
        user: data.user,
        session: data.session
      },
      message: 'User created successfully. Please check your email for verification.'
    });
  } catch (error) {
    console.error('Error in signUp:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message
    });
  }
};

/**
 * Sign in an existing user
 */
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      data: {
        user: data.user,
        session: data.session
      },
      message: 'Signed in successfully'
    });
  } catch (error) {
    console.error('Error in signIn:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sign in',
      details: error.message
    });
  }
};

/**
 * Sign out the current user
 */
const signOut = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Signed out successfully'
    });
  } catch (error) {
    console.error('Error in signOut:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sign out',
      details: error.message
    });
  }
};

/**
 * Get the current user's profile
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached by auth middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
      details: error.message
    });
  }
};

/**
 * Verify a user's session token
 */
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    res.json({
      success: true,
      data: {
        user: data.user,
        valid: true
      }
    });
  } catch (error) {
    console.error('Error in verifyToken:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify token',
      details: error.message
    });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getProfile,
  verifyToken
};
