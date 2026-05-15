const cron = require('node-cron');
const User = require('../models/User');

/**
 * Maintenance Billing Service
 * Tracks monthly maintenance payments for Institutional clients.
 * Runs every day at midnight to check for expired subscriptions or pending maintenance.
 */
const startMaintenanceBillingService = () => {
  // Schedule: Every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[BILLING SERVICE] Running daily maintenance check...');
    
    try {
      const now = new Date();
      
      // Find institutional users whose subscription might be past due
      // In a real app, you'd check a 'maintenanceExpiryDate' or verify with Razorpay
      const institutionalUsers = await User.find({ 
        'subscription.plan': 'institutional',
        'subscription.status': 'active'
      });

      for (const user of institutionalUsers) {
        if (user.subscription.expiryDate && user.subscription.expiryDate < now) {
          console.warn(`[BILLING SERVICE] Maintenance failed for user: ${user.email}. Setting to past_due.`);
          
          user.subscription.status = 'past_due';
          // In a real setup, you'd trigger a Razorpay Subscription charge here
          // If the charge fails, we keep it as past_due or inactive
          await user.save();
        }
      }

      console.log(`[BILLING SERVICE] Daily check complete. Processed ${institutionalUsers.length} institutional users.`);
    } catch (error) {
      console.error('[BILLING SERVICE] Error during maintenance check:', error.message);
    }
  });
};

module.exports = { startMaintenanceBillingService };
