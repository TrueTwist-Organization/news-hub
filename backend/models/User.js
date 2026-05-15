const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  location: { 
    type: String, 
    default: 'Gandhinagar, Gujarat' 
  },
  subscription: {
    plan: {
      type: String,
      enum: ['none', 'reader', 'pro', 'api', 'institutional'],
      default: 'none'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'past_due'],
      default: 'inactive'
    },
    razorpay_order_id:   { type: String, default: null },
    razorpay_payment_id: { type: String, default: null },
    startDate:           { type: Date,   default: null },
    expiryDate:          { type: Date,   default: null },
    manualSetupRequired: { type: Boolean, default: false }
  },
  trialUsage: {
    articleCount: { type: Number, default: 0 },
    lastReadDate: { type: Date, default: null }
  },
  apiKey: {
    key: { type: String, default: null },
    active: { type: Boolean, default: false },
    createdAt: { type: Date, default: null }
  }
}, { timestamps: true });

// Pre-save middleware for password hashing (Modern Async Style)
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Helper method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');
