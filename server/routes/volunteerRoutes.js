const express = require('express')
const router = express.Router()
const {
  getAllVolunteers,
  getVolunteerById,
  updateAvailability,
  updateProfile
} = require('../controllers/volunteerController')
const { protect, restrictTo } = require('../middleware/auth')

router.get('/', protect, restrictTo('admin'), getAllVolunteers)
router.get('/:id', protect, getVolunteerById)
router.patch('/me/availability', protect, restrictTo('volunteer'), updateAvailability)
router.patch('/me/profile', protect, restrictTo('volunteer'), updateProfile)

module.exports = router