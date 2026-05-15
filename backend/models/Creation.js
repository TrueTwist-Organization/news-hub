const mongoose = require('mongoose');

const creationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'news', // 'news', 'automated_post', 'manual_save'
  },
  fbLink: {
    type: String,
    default: '',
  },
  fbPostId: {
    type: String,
    default: '',
  },
  isAiGenerated: {
    type: Boolean,
    default: false,
  },
  postedToFb: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: 'General',
  }
}, {
  timestamps: true,
  // Ensure virtuals are included when converting to JSON (for frontend 'id' field)
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Duplicate the _id as id for frontend compatibility
creationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Creation', creationSchema);
