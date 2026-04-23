const mongoose = require('mongoose')
const Survey = mongoose.model('Survey')
const { extractTextFromImage, parseSurveyText } = require('../utils/visionOCR')
const { analyzeUrgency } = require('../utils/geminiAI')

const uploadSurvey = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      })
    }

    const ocrResult = await extractTextFromImage(req.file.buffer)

    if (!ocrResult.success) {
      return res.status(422).json({
        success: false,
        message: ocrResult.message || 'Could not read text from image'
      })
    }

    const parsedData = parseSurveyText(ocrResult.text)

    const aiAnalysis = await analyzeUrgency({
      ...parsedData,
      rawText: ocrResult.text
    })

    const survey = await Survey.create({
      uploadedBy: req.user.id,
      rawText: ocrResult.text,
      extractedData: {
        ...parsedData,
        urgency: aiAnalysis.success
          ? aiAnalysis.data.urgencyLevel
          : parsedData.urgency
      },
      aiUrgencyScore: aiAnalysis.success ? aiAnalysis.data.urgencyScore : 50,
      aiAnalysis: aiAnalysis.success ? aiAnalysis.data : null,
      status: 'pending'
    })

    res.status(201).json({
      success: true,
      message: 'Survey uploaded and analyzed successfully',
      survey: {
        id: survey._id,
        rawText: survey.rawText,
        extractedData: survey.extractedData,
        aiUrgencyScore: survey.aiUrgencyScore,
        aiAnalysis: survey.aiAnalysis,
        status: survey.status,
        createdAt: survey.createdAt
      }
    })

  } catch (error) {
    console.error('Survey upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during survey upload'
    })
  }
}

const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find()
      .populate('uploadedBy', 'name email')
      .sort({ aiUrgencyScore: -1, createdAt: -1 })
      .limit(50)

    res.status(200).json({
      success: true,
      count: surveys.length,
      surveys
    })

  } catch (error) {
    console.error('Get surveys error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching surveys'
    })
  }
}

const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate('uploadedBy', 'name email')

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      })
    }

    res.status(200).json({
      success: true,
      survey
    })

  } catch (error) {
    console.error('Get survey error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error fetching survey'
    })
  }
}

module.exports = { uploadSurvey, getAllSurveys, getSurveyById }