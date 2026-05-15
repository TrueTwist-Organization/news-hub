const User = require('../models/User');

/**
 * checkProSubscription
 * Middleware — verifies the authenticated user holds an active Neural Pro subscription.
 * Must be used AFTER authMiddleware (which attaches req.user).
 *
 * Flow:
 *   authMiddleware → checkProSubscription → route handler
 *
 * On success : calls next()
 * On failure : 403 Access Denied
 */
const checkProSubscription = async (req, res, next) => {
  try {
    // req.user is set by the upstream authMiddleware (contains { userId, role })
    
    // 1. Check if the user is an Admin. Admins bypass subscription checks.
    // We check case-insensitively just in case.
    if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
      return next();
    }

    // Identify user using req.user.userId (matching the JWT payload)
    const user = await User.findById(req.user.userId).select('subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { plan, status, expiryDate } = user.subscription;

    // Verify plan, active status, and that the subscription has not expired
    const isExpired = expiryDate && new Date(expiryDate) < new Date();

    if (plan === 'pro' && status === 'active' && !isExpired) {
      return next(); // ✅ Pro & active — allow through
    }

    // Subscription lapsed — flip status to inactive in DB silently
    if (isExpired && status === 'active') {
      await User.findByIdAndUpdate(req.user.userId, {
        'subscription.status': 'inactive'
      });
    }

    return res.status(403).json({
      message: 'Access Denied: Neural Pro subscription required.'
    });

  } catch (error) {
    console.error('[checkProSubscription] Error:', error.message);
    return res.status(500).json({ message: 'Server error during subscription check.' });
  }
};

module.exports = checkProSubscription;
