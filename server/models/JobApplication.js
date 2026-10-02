const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  company: {
    type: String,
    required: true,
    trim: true,
  },

  position: {
    type: String,
    required: true,
    trim: true,
  },

  status: {
    type: String,
    enum: [
      'pending',
      'interview',
      'accepted',
      'rejected',
    ],
    default: 'pending',
  },

  appliedDate: {
    type: Date,
    required: true,
  },

  salary: {
    type: String,
    default: '',
    trim: true,
  },

  location: {
    type: String,
    default: '',
    trim: true,
  },

  jobUrl: {
    type: String,
    default: '',
    trim: true,
  },

  notes: {
    type: String,
    default: '',
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  'JobApplication',
  jobApplicationSchema
);