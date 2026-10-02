
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  type: {
    type: String,
    enum: [
      'resume',
      'application',
      'interview',
      'analysis',
      'auth',
      'profile',
    ],
    required: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  details: {
    type: String,
    default: '',
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Activity', activitySchema);

