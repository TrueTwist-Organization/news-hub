const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Removed MongoDB


/**
 * Protect middleware: Verifies JWT and attaches full user object to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token strictly using env variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log('[DEBUG AUTH] Decoded Token:', decoded);

    // MOCK/LOCAL MODE: No DB query
    const userId = decoded.userId || decoded.id;

    req.user = {
      _id: userId,
      email: decoded.email || 'user@local.dev',
      role: decoded.role || 'user',
      subscription: { plan: 'none', status: 'inactive' }
    };

    next();
  } catch (error) {
    console.error('[AUTH ERROR]:', error.message);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = { authMiddleware };
