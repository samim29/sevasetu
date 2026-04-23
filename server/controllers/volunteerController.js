const mongoose = require('mongoose')
const Volunteer = mongoose.model('Volunteer')
const User = mongoose.model('User')

const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers
    })

  } catch (error) {
    console.error('Get volunteers error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching volunteers'
    })
  }
}

const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)
      .populate('userId', 'name email createdAt')

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      })
    }

    res.status(200).json({ success: true, volunteer })

  } catch (error) {
    console.error('Get volunteer error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching volunteer'
    })
  }
}

const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body
    const validOptions = ['available', 'busy', 'unavailable']

    if (!validOptions.includes(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status'
      })
    }

    const volunteer = await Volunteer.findOne({ userId: req.user.id })

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer profile not found'
      })
    }

    volunteer.availability = availability
    await volunteer.save()

    res.status(200).json({
      success: true,
      message: 'Availability updated',
      volunteer
    })

  } catch (error) {
    console.error('Update availability error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating availability'
    })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { skills, area } = req.body

    const volunteer = await Volunteer.findOne({ userId: req.user.id })

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer profile not found'
      })
    }

    if (skills) volunteer.skills = skills
    if (area) volunteer.location.area = area
    await volunteer.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      volunteer
    })

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    })
  }
}

module.exports = {
  getAllVolunteers,
  getVolunteerById,
  updateAvailability,
  updateProfile
}