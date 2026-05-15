const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Profile (Protected)
const { authMiddleware } = require('../middleware/auth');
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
