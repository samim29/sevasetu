const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config()

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected...')

  const User = mongoose.model('User', require('./models/User').schema)
  const Volunteer = mongoose.model('Volunteer', require('./models/Volunteer').schema)
  const Survey = mongoose.model('Survey', require('./models/Survey').schema)
  const Task = mongoose.model('Task', require('./models/Task').schema)

  // ─── Users ───────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12)
  const volPassword = await bcrypt.hash('volunteer123', 12)

  const admin = await User.create({
    name: 'Arjun Mehta',
    email: 'admin@sevasetu.com',
    password: adminPassword,
    role: 'admin'
  })

  const vol1 = await User.create({
    name: 'Rahul Sharma',
    email: 'rahul@sevasetu.com',
    password: volPassword,
    role: 'volunteer'
  })

  const vol2 = await User.create({
    name: 'Priya Roy',
    email: 'priya@sevasetu.com',
    password: volPassword,
    role: 'volunteer'
  })

  const vol3 = await User.create({
    name: 'Amit Das',
    email: 'amit@sevasetu.com',
    password: volPassword,
    role: 'volunteer'
  })

  const vol4 = await User.create({
    name: 'Sneha Bose',
    email: 'sneha@sevasetu.com',
    password: volPassword,
    role: 'volunteer'
  })

  const vol5 = await User.create({
    name: 'Rajesh Kumar',
    email: 'rajesh@sevasetu.com',
    password: volPassword,
    role: 'volunteer'
  })

  console.log('✅ Users created')

  // ─── Volunteer Profiles ───────────────────────────────
  const v1 = await Volunteer.create({
    userId: vol1._id,
    skills: ['Medical', 'First Aid', 'Nursing'],
    location: { area: 'Ward 12, Tangra', city: 'Kolkata' },
    availability: 'available',
    tasksCompleted: 8
  })

  const v2 = await Volunteer.create({
    userId: vol2._id,
    skills: ['Teaching', 'Counseling', 'Child Care'],
    location: { area: 'Ward 5, Topsia', city: 'Kolkata' },
    availability: 'available',
    tasksCompleted: 5
  })

  const v3 = await Volunteer.create({
    userId: vol3._id,
    skills: ['Driving', 'Logistics', 'Food Distribution'],
    location: { area: 'Garden Reach', city: 'Kolkata' },
    availability: 'available',
    tasksCompleted: 12
  })

  const v4 = await Volunteer.create({
    userId: vol4._id,
    skills: ['Social Work', 'Community Outreach', 'Documentation'],
    location: { area: 'Shyambazar', city: 'Kolkata' },
    availability: 'busy',
    tasksCompleted: 3
  })

  const v5 = await Volunteer.create({
    userId: vol5._id,
    skills: ['Construction', 'Electrical', 'Plumbing'],
    location: { area: 'Entally', city: 'Kolkata' },
    availability: 'available',
    tasksCompleted: 6
  })

  console.log('✅ Volunteer profiles created')

  // ─── Surveys ──────────────────────────────────────────
  const s1 = await Survey.create({
    uploadedBy: admin._id,
    rawText: 'Name: Rekha Devi\nArea: Ward 12, Tangra\nIssue: Food shortage, family has not eaten for 2 days\nFamily Members: 5\nContact: 9831000001\nUrgency: Critical',
    extractedData: {
      name: 'Rekha Devi',
      area: 'Ward 12, Tangra',
      issue: 'Food shortage, family has not eaten for 2 days',
      familySize: 5,
      urgency: 'critical',
      contact: '9831000001'
    },
    aiUrgencyScore: 92,
    aiAnalysis: {
      urgencyLevel: 'critical',
      urgencyScore: 92,
      reasoning: 'Family of 5 has not eaten for 2 days — immediate food relief required.',
      recommendedAction: 'Deploy food distribution volunteer to Ward 12 immediately',
      timeframe: 'immediate'
    },
    status: 'pending'
  })

  const s2 = await Survey.create({
    uploadedBy: admin._id,
    rawText: 'Name: Rahul Kumar\nArea: Ward 5, Topsia\nIssue: Medical emergency, elderly patient needs urgent care\nFamily Members: 3\nContact: 9830000002\nUrgency: Critical',
    extractedData: {
      name: 'Rahul Kumar',
      area: 'Ward 5, Topsia',
      issue: 'Medical emergency, elderly patient needs urgent care',
      familySize: 3,
      urgency: 'critical',
      contact: '9830000002'
    },
    aiUrgencyScore: 95,
    aiAnalysis: {
      urgencyLevel: 'critical',
      urgencyScore: 95,
      reasoning: 'Elderly patient with medical emergency requires immediate medical attention.',
      recommendedAction: 'Send medical volunteer with first aid kit to Ward 5 immediately',
      timeframe: 'immediate'
    },
    status: 'assigned'
  })

  const s3 = await Survey.create({
    uploadedBy: admin._id,
    rawText: 'Name: Fatima Begum\nArea: Garden Reach\nIssue: Flood relief needed, house damaged\nFamily Members: 7\nContact: 9832000003\nUrgency: High',
    extractedData: {
      name: 'Fatima Begum',
      area: 'Garden Reach',
      issue: 'Flood relief needed, house damaged',
      familySize: 7,
      urgency: 'high',
      contact: '9832000003'
    },
    aiUrgencyScore: 78,
    aiAnalysis: {
      urgencyLevel: 'high',
      urgencyScore: 78,
      reasoning: 'Large family of 7 displaced due to flood damage requiring shelter and supplies.',
      recommendedAction: 'Coordinate relief supplies and temporary shelter for affected family',
      timeframe: 'within24hours'
    },
    status: 'pending'
  })

  const s4 = await Survey.create({
    uploadedBy: admin._id,
    rawText: 'Name: Suresh Mondal\nArea: Shyambazar\nIssue: Children out of school, need education support\nFamily Members: 4\nContact: 9833000004\nUrgency: Medium',
    extractedData: {
      name: 'Suresh Mondal',
      area: 'Shyambazar',
      issue: 'Children out of school, need education support',
      familySize: 4,
      urgency: 'medium',
      contact: '9833000004'
    },
    aiUrgencyScore: 55,
    aiAnalysis: {
      urgencyLevel: 'medium',
      urgencyScore: 55,
      reasoning: 'Children missing education — important but not immediately life threatening.',
      recommendedAction: 'Assign teaching volunteer to provide home education support',
      timeframe: 'within week'
    },
    status: 'pending'
  })

  const s5 = await Survey.create({
    uploadedBy: admin._id,
    rawText: 'Name: Anita Singh\nArea: Entally\nIssue: Winter clothing needed for children\nFamily Members: 6\nContact: 9834000005\nUrgency: Medium',
    extractedData: {
      name: 'Anita Singh',
      area: 'Entally',
      issue: 'Winter clothing needed for children',
      familySize: 6,
      urgency: 'medium',
      contact: '9834000005'
    },
    aiUrgencyScore: 48,
    aiAnalysis: {
      urgencyLevel: 'medium',
      urgencyScore: 48,
      reasoning: 'Children need warm clothing for winter season.',
      recommendedAction: 'Organize clothing drive and deliver to Entally family',
      timeframe: 'within week'
    },
    status: 'resolved'
  })

  const s6 = await Survey.create({
    uploadedBy: admin._id,
    rawText: 'Name: Mohammed Ali\nArea: Park Circus\nIssue: Elderly person living alone needs daily assistance\nFamily Members: 1\nContact: 9835000006\nUrgency: High',
    extractedData: {
      name: 'Mohammed Ali',
      area: 'Park Circus',
      issue: 'Elderly person living alone needs daily assistance',
      familySize: 1,
      urgency: 'high',
      contact: '9835000006'
    },
    aiUrgencyScore: 72,
    aiAnalysis: {
      urgencyLevel: 'high',
      urgencyScore: 72,
      reasoning: 'Elderly person living alone with no support system needs regular assistance.',
      recommendedAction: 'Assign social worker volunteer for daily check-ins',
      timeframe: 'within24hours'
    },
    status: 'pending'
  })

  console.log('✅ Surveys created')

  // ─── Tasks ────────────────────────────────────────────
  await Task.create({
    title: 'Emergency Food Distribution — Ward 12',
    description: 'Family of 5 has not eaten for 2 days. Deliver food supplies immediately.',
    area: 'Ward 12, Tangra',
    urgency: 'critical',
    status: 'open',
    requiredSkills: ['Food Distribution', 'Logistics'],
    surveyRef: s1._id,
    createdBy: admin._id
  })

  await Task.create({
    title: 'Medical Assistance — Elderly Patient',
    description: 'Elderly patient needs urgent medical care and medication.',
    area: 'Ward 5, Topsia',
    urgency: 'critical',
    status: 'assigned',
    requiredSkills: ['Medical', 'First Aid'],
    assignedTo: v1._id,
    surveyRef: s2._id,
    createdBy: admin._id
  })

  await Task.create({
    title: 'Flood Relief — Garden Reach',
    description: 'Family of 7 displaced. Need shelter support and supplies.',
    area: 'Garden Reach',
    urgency: 'high',
    status: 'in_progress',
    requiredSkills: ['Logistics', 'Driving'],
    assignedTo: v3._id,
    surveyRef: s3._id,
    createdBy: admin._id
  })

  await Task.create({
    title: 'Education Support — Shyambazar',
    description: 'Provide home tutoring for children who cannot attend school.',
    area: 'Shyambazar',
    urgency: 'medium',
    status: 'open',
    requiredSkills: ['Teaching', 'Child Care'],
    surveyRef: s4._id,
    createdBy: admin._id
  })

  await Task.create({
    title: 'Clothing Drive Delivery — Entally',
    description: 'Deliver collected winter clothing to family of 6.',
    area: 'Entally',
    urgency: 'medium',
    status: 'completed',
    requiredSkills: ['Driving'],
    assignedTo: v3._id,
    surveyRef: s5._id,
    createdBy: admin._id,
    completedAt: new Date()
  })

  await Task.create({
    title: 'Daily Assistance — Elderly Person',
    description: 'Regular check-ins and daily assistance for elderly person living alone.',
    area: 'Park Circus',
    urgency: 'high',
    status: 'open',
    requiredSkills: ['Social Work', 'Community Outreach'],
    surveyRef: s6._id,
    createdBy: admin._id
  })

  console.log('✅ Tasks created')
  console.log('')
  console.log('🎉 Demo data seeded successfully!')
  console.log('')
  console.log('Login credentials:')
  console.log('Admin  → admin@sevasetu.com / admin123')
  console.log('Vol 1  → rahul@sevasetu.com / volunteer123')
  console.log('Vol 2  → priya@sevasetu.com / volunteer123')
  console.log('Vol 3  → amit@sevasetu.com / volunteer123')
  console.log('Vol 4  → sneha@sevasetu.com / volunteer123')
  console.log('Vol 5  → rajesh@sevasetu.com / volunteer123')

  process.exit(0)
}

seed().catch(err => {
  console.error('Seed error:', err)
  process.exit(1)
})

/*
Login credentials:
Admin  → admin@sevasetu.com / admin123
Vol 1  → rahul@sevasetu.com / volunteer123
Vol 2  → priya@sevasetu.com / volunteer123
Vol 3  → amit@sevasetu.com / volunteer123
Vol 4  → sneha@sevasetu.com / volunteer123
Vol 5  → rajesh@sevasetu.com / volunteer123

*/ 