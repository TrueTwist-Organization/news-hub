const User = require('../models/User');
const crypto = require('crypto');

/**
 * Middleware to check trial limits for 'reader' plan.
 * Limits users to 2 articles per month on the reader tier.
 */
const checkTrialLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only apply limit if plan is 'reader'
    if (user.subscription.plan === 'reader') {
      const now = new Date();
      const lastRead = user.trialUsage.lastReadDate;
      
      // Reset count if it's a new month
      if (lastRead && (now.getMonth() !== lastRead.getMonth() || now.getFullYear() !== lastRead.getFullYear())) {
        user.trialUsage.articleCount = 0;
      }

      if (user.trialUsage.articleCount >= 2) {
        return res.status(403).json({ 
          limitReached: true, 
          message: 'Monthly trial limit reached. Please upgrade to Pro for unlimited access.' 
        });
      }

      // Increment count and update last read date
      user.trialUsage.articleCount += 1;
      user.trialUsage.lastReadDate = now;
      await user.save();
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to verify API Key for Engine Access (api) plan.
 * Used for external requests.
 */
const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ success: false, message: 'API Key is required.' });
    }

    const user = await User.findOne({ 'apiKey.key': apiKey, 'apiKey.active': true });
    if (!user) {
      return res.status(403).json({ success: false, message: 'Invalid or inactive API Key.' });
    }

    // Attach user to request for further use
    req.apiUser = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkTrialLimit,
  verifyApiKey
};
