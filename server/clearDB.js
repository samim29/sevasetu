const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const clear = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected...')

  await mongoose.connection.collection('users').deleteMany({})
  await mongoose.connection.collection('volunteers').deleteMany({})
  await mongoose.connection.collection('surveys').deleteMany({})
  await mongoose.connection.collection('tasks').deleteMany({})

  console.log('✅ All collections cleared!')
  process.exit(0)
}

clear()