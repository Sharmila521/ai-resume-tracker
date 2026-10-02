const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileData: {
    type: Buffer, // Store PDF as binary
    required: true,
  },
  atsScore: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ['uploaded', 'analyzing', 'analyzed'],
    default: 'uploaded',
  },
  version: {
    type: String,
    default: 'v1',
  },
  analysis: {
    scores: {
      ats: Number,
      keyword: Number,
      formatting: Number,
      impact: Number,
      clarity: Number,
    },
    strengths: [String],
    issues: [String],
    presentKeywords: [String],
    missingKeywords: [String],
    suggestions: [
      {
        original: String,
        optimized: String,
      },
    ],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', resumeSchema);