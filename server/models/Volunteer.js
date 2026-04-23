const mongoose = require('mongoose')

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name too long']
  }],
  location: {
    area: {
      type: String,
      trim: true,
      maxlength: [100, 'Area name too long']
    },
    city: {
      type: String,
      trim: true,
      default: 'Kolkata'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  tasksCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, { timestamps: true })

module.exports = mongoose.model('Volunteer', volunteerSchema)