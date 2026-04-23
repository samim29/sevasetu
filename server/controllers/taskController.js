const mongoose = require('mongoose')
const Task = mongoose.model('Task')
const Volunteer = mongoose.model('Volunteer')
const { matchVolunteers } = require('../utils/geminiAI')

const createTask = async (req, res) => {
  try {
    const {
      title, description, area,
      urgency, requiredSkills, surveyRef
    } = req.body

    if (!title || !area) {
      return res.status(400).json({
        success: false,
        message: 'Title and area are required'
      })
    }

    const task = await Task.create({
      title,
      description,
      area,
      urgency: urgency || 'medium',
      requiredSkills: requiredSkills || [],
      surveyRef: surveyRef || null,
      createdBy: req.user.id
    })

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    })

  } catch (error) {
    console.error('Create task error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error creating task'
    })
  }
}

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'name email')
      .populate('assignedTo')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    })

  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks'
    })
  }
}

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'assignedTo',
        populate: { path: 'userId', select: 'name email' }
      })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    res.status(200).json({ success: true, task })

  } catch (error) {
    console.error('Get task error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching task'
    })
  }
}

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['open', 'assigned', 'in_progress', 'completed', 'cancelled']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      })
    }

    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    task.status = status
    if (status === 'completed') task.completedAt = new Date()
    await task.save()

    res.status(200).json({
      success: true,
      message: 'Task status updated',
      task
    })

  } catch (error) {
    console.error('Update task error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating task'
    })
  }
}

const getAIMatchedVolunteers = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    const volunteers = await Volunteer.find({ availability: 'available' })
      .populate('userId', 'name email')

    if (volunteers.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No available volunteers found',
        matches: []
      })
    }

    const aiResult = await matchVolunteers(task, volunteers)

    if (!aiResult.success) {
      return res.status(200).json({
        success: true,
        message: 'AI matching unavailable, showing all volunteers',
        matches: volunteers.map(v => ({
          volunteer: v,
          matchScore: 50,
          reasoning: 'Manual review required'
        }))
      })
    }

    const enrichedMatches = aiResult.data.matches
      .map(match => {
        const volunteer = volunteers.find(
          v => v._id.toString() === match.volunteerId
        )
        return volunteer
          ? { volunteer, matchScore: match.matchScore, reasoning: match.reasoning }
          : null
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore)

    res.status(200).json({
      success: true,
      recommendation: aiResult.data.recommendation,
      matches: enrichedMatches
    })

  } catch (error) {
    console.error('AI match error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during AI matching'
    })
  }
}

const assignVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    const volunteer = await Volunteer.findById(volunteerId)
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      })
    }

    task.assignedTo = volunteerId
    task.status = 'assigned'
    await task.save()

    volunteer.availability = 'busy'
    await volunteer.save()

    res.status(200).json({
      success: true,
      message: 'Volunteer assigned successfully',
      task
    })

  } catch (error) {
    console.error('Assign volunteer error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error assigning volunteer'
    })
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  getAIMatchedVolunteers,
  assignVolunteer
}