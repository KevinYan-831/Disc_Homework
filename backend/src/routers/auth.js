const express = require('express');
const { signUp, signIn, signOut, getProfile, verifyToken } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/verify', verifyToken);

// Protected routes
router.get('/profile', requireAuth, getProfile);

module.exports = router;
