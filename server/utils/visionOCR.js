const Tesseract = require('tesseract.js')

const extractTextFromImage = async (imageBuffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imageBuffer,
      'eng',
      {
        logger: () => {}
      }
    )

    if (!text || text.trim().length === 0) {
      return {
        success: false,
        text: '',
        message: 'No text found in image'
      }
    }

    return {
      success: true,
      text: text.trim()
    }

  } catch (error) {
    console.error('Tesseract OCR error:', error.message)
    return {
      success: false,
      text: '',
      message: 'Failed to extract text from image'
    }
  }
}

const parseSurveyText = (rawText) => {
  const data = {
    name: '',
    area: '',
    issue: '',
    familySize: null,
    urgency: 'medium',
    contact: ''
  }

  const lines = rawText.toLowerCase().split('\n')

  lines.forEach(line => {
    if (line.includes('name:') || line.includes('naam:')) {
      data.name = line.split(':')[1]?.trim() || ''
    }
    if (
      line.includes('area:') ||
      line.includes('address:') ||
      line.includes('location:')
    ) {
      data.area = line.split(':')[1]?.trim() || ''
    }
    if (
      line.includes('issue:') ||
      line.includes('problem:') ||
      line.includes('need:')
    ) {
      data.issue = line.split(':')[1]?.trim() || ''
    }
    if (line.includes('family') || line.includes('members:')) {
      const num = line.match(/\d+/)
      if (num) data.familySize = parseInt(num[0])
    }
    if (
      line.includes('contact:') ||
      line.includes('phone:') ||
      line.includes('mobile:')
    ) {
      data.contact = line.split(':')[1]?.trim() || ''
    }
    if (
      line.includes('urgent') ||
      line.includes('critical') ||
      line.includes('emergency')
    ) {
      data.urgency = 'critical'
    } else if (line.includes('high')) {
      data.urgency = 'high'
    } else if (line.includes('low')) {
      data.urgency = 'low'
    }
  })

  return data
}

module.exports = { extractTextFromImage, parseSurveyText }