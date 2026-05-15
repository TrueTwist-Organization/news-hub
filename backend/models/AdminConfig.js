const mongoose = require('mongoose');

const adminConfigSchema = new mongoose.Schema({
  facebookToken: {
    type: String,
    default: '',
  },
  facebookPageId: {
    type: String,
    default: '',
  },
  postTiming: {
    type: String,
    default: '20:00',
  },
  morningTime: {
    type: String,
    default: '10:00',
  },
  afternoonTime: {
    type: String,
    default: '14:00',
  },
  nightTime: {
    type: String,
    default: '20:00',
  },
  isAutomationEnabled: {
    type: Boolean,
    default: false,
  },
  rssSources: [
    {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
  lastRunStatus: {
    lastRunAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Idle'],
      default: 'Idle',
    },
    message: {
      type: String,
      default: '',
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminConfig', adminConfigSchema);
