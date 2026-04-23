const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const analyzeUrgency = async (surveyData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `
You are an AI assistant helping an NGO prioritize community needs.

Analyze this survey data and provide urgency assessment:
- Name: ${surveyData.name || 'Unknown'}
- Area: ${surveyData.area || 'Unknown'}
- Issue: ${surveyData.issue || 'Unknown'}
- Family Size: ${surveyData.familySize || 'Unknown'}
- Raw Survey Text: ${surveyData.rawText || ''}

Respond ONLY in this exact JSON format with no extra text:
{
  "urgencyLevel": "critical|high|medium|low",
  "urgencyScore": <number between 0-100>,
  "reasoning": "<brief 1-2 sentence explanation>",
  "recommendedAction": "<specific action NGO should take>",
  "timeframe": "immediate|within24hours|within week|non-urgent"
}
`
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return { success: true, data: parsed }

  } catch (error) {
    console.error('Gemini urgency error:', error.message)
    return {
      success: false,
      data: {
        urgencyLevel: 'medium',
        urgencyScore: 50,
        reasoning: 'AI analysis unavailable',
        recommendedAction: 'Manual review required',
        timeframe: 'within week'
      }
    }
  }
}

const matchVolunteers = async (task, volunteers) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const volunteerList = volunteers.map((v, i) => `
Volunteer ${i + 1}:
- ID: ${v._id}
- Name: ${v.userId?.name || 'Unknown'}
- Skills: ${v.skills?.join(', ') || 'None listed'}
- Area: ${v.location?.area || 'Unknown'}
- Availability: ${v.availability}
- Tasks Completed: ${v.tasksCompleted}
`).join('\n')

    const prompt = `
You are an AI assistant helping an NGO match volunteers to tasks.

Task Details:
- Title: ${task.title}
- Description: ${task.description || ''}
- Area: ${task.area}
- Urgency: ${task.urgency}
- Required Skills: ${task.requiredSkills?.join(', ') || 'None specified'}

Available Volunteers:
${volunteerList}

Rank these volunteers by suitability and respond ONLY in this exact JSON format:
{
  "matches": [
    {
      "volunteerId": "<volunteer _id>",
      "matchScore": <0-100>,
      "reasoning": "<brief reason why this volunteer is suitable>"
    }
  ],
  "recommendation": "<overall recommendation for this task>"
}

Order matches from best to worst. Include all volunteers.
`
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return { success: true, data: parsed }

  } catch (error) {
    console.error('Gemini matching error:', error.message)
    return { success: false, data: null }
  }
}

module.exports = { analyzeUrgency, matchVolunteers }