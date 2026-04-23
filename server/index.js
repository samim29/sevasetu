const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()

require('./models/User')
require('./models/Volunteer')
require('./models/Survey')
require('./models/Task')


const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err))


const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const surveyRoutes = require('./routes/surveyRoutes')
app.use('/api/surveys', surveyRoutes)

const taskRoutes = require('./routes/taskRoutes')
app.use('/api/tasks', taskRoutes)

const volunteerRoutes = require('./routes/volunteerRoutes')
app.use('/api/volunteers', volunteerRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'SevaSetu API running' })
})


const PORT = process.env.PORT || 5000
app.use(express.static(path.join(__dirname, '../client/dist')))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))