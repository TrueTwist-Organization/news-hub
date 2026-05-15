require('dotenv').config();
const mongoose = require('mongoose');

const clearUsers = async () => {
  try {
    console.log('[CLEANUP] Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[CLEANUP] Connected successfully.');

    const User = require('../models/User');
    const result = await User.deleteMany({});
    console.log(`[CLEANUP] Deleted ${result.deletedCount} users from the database.`);
    
    process.exit(0);
  } catch (error) {
    console.error('[CLEANUP] Error during cleanup:', error.message);
    process.exit(1);
  }
};

clearUsers();
