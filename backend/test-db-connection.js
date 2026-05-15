const mongoose = require('mongoose');
require('dotenv').config();

const dbUri = process.env.MONGO_URI;

console.log('Attempting to connect to:', dbUri ? dbUri.split('@')[1] : 'MISSING');

mongoose.connect(dbUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    const User = require('./models/User');
    const users = await User.find({}, 'email role');
    console.log('Users in DB:', users);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
