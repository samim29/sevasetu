const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  extractedData: {
    name: { type: String, trim: true },
    area: { type: String, trim: true },
    issue: { type: String, trim: true },
    familySize: { type: Number, min: 1 },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    contact: { type: String, trim: true }
  },
  aiUrgencyScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  aiAnalysis: {
    urgencyLevel: String,
    urgencyScore: Number,
    reasoning: String,
    recommendedAction: String,
    timeframe: String
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'assigned', 'resolved'],
    default: 'pending'
  },
  rawText: {
    type: String,
    maxlength: [2000, 'Raw text too long']
  }
}, { timestamps: true })

module.exports = mongoose.model('Survey', surveySchema)