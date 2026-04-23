const express = require('express')
const router = express.Router()
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  getAIMatchedVolunteers,
  assignVolunteer
} = require('../controllers/taskController')
const { protect, restrictTo } = require('../middleware/auth')

router.post('/', protect, restrictTo('admin'), createTask)
router.get('/', protect, getAllTasks)
router.get('/:id', protect, getTaskById)
router.patch('/:id/status', protect, updateTaskStatus)
router.get('/:id/match', protect, restrictTo('admin'), getAIMatchedVolunteers)
router.post('/:id/assign', protect, restrictTo('admin'), assignVolunteer)

module.exports = router