const express = require('express')
const router = express.Router()
const { uploadSurvey, getAllSurveys, getSurveyById } = require('../controllers/surveyController')
const { protect, restrictTo } = require('../middleware/auth')
const upload = require('../middleware/upload')

router.post(
  '/upload',
  protect,
  restrictTo('admin'),
  upload.single('survey'),
  uploadSurvey
)

router.get('/', protect, getAllSurveys)
router.get('/:id', protect, getSurveyById)

module.exports = router