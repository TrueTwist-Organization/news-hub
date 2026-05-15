const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const resetAdmin = async () => {
  try {
    console.log('[RESET] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[RESET] Connected successfully.');

    const adminEmail = 'admin123@gmail.com'; // New admin email
    const newPassword = 'admin'; // Simple password for recovery, user should change it later

    console.log(`[RESET] Finding user with email: ${adminEmail}`);
    let user = await User.findOne({ email: adminEmail });

    if (!user) {
      console.log('[RESET] Admin user not found. Creating new admin user...');
      user = new User({
        email: adminEmail,
        password: newPassword, // This will be hashed by the pre-save hook
        role: 'admin',
        subscription: { plan: 'pro', status: 'active' }
      });
    } else {
      console.log('[RESET] Admin user found. Updating password...');
      user.password = newPassword; // This will be hashed by the pre-save hook
      user.role = 'admin'; // Ensure role is admin
    }

    await user.save();
    console.log('[RESET] Password successfully reset and hashed.');
    console.log('[RESET] You can now login with:');
    console.log(`[RESET] Email: ${adminEmail}`);
    console.log(`[RESET] Password: ${newPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('[RESET] Error:', error);
    process.exit(1);
  }
};

resetAdmin();
