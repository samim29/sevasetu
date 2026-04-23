import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'
import './Tasks.css'

const UrgencyBadge = ({ urgency }) => (
  <span className={`badge badge-${urgency}`}>{urgency}</span>
)

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-${status}`}>
    {status.replace('_', ' ')}
  </span>
)

const AIMatchModal = ({ task, onClose, onAssigned }) => {
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState([])
  const [recommendation, setRecommendation] = useState('')
  const [assigning, setAssigning] = useState(null)

  useEffect(() => { fetchMatches() }, [])

  const fetchMatches = async () => {
    try {
      const res = await api.get(`/api/tasks/${task._id}/match`)
      setMatches(res.data.matches || [])
      setRecommendation(res.data.recommendation || '')
    } catch (error) {
      toast.error('Failed to fetch AI matches')
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (volunteerId) => {
    setAssigning(volunteerId)
    try {
      await api.post(`/api/tasks/${task._id}/assign`, { volunteerId })
      toast.success('Volunteer assigned successfully!')
      onAssigned()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign volunteer')
    } finally {
      setAssigning(null)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'V'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#3b6d11'
    if (score >= 60) return '#854f0b'
    return '#a32d2d'
  }

  return (
    <div className="modal-overlay">
      <div className="modal modal-wide">
        <div className="modal-header">
          <div>
            <h2>AI Volunteer Matching</h2>
            <p className="modal-subtitle">Task: {task.title}</p>
          </div>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        {recommendation && (
          <div className="ai-recommendation">
            <p className="ai-rec-label">🤖 Gemini Recommendation</p>
            <p className="ai-rec-text">{recommendation}</p>
          </div>
        )}

        <div className="modal-body">
          {loading ? (
            <div className="match-loading">
              <div className="spinner"></div>
              <p>Gemini AI is analyzing volunteer profiles...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="empty-state">
              <p>No available volunteers found.</p>
            </div>
          ) : (
            <div className="matches-list">
              {matches.map((match, index) => (
                <div key={match.volunteer._id} className="match-card">
                  <div className="match-rank">#{index + 1}</div>
                  <div
                    className="match-avatar"
                    style={{
                      backgroundColor: index === 0 ? '#185fa5'
                        : index === 1 ? '#3b6d11' : '#854f0b'
                    }}
                  >
                    {getInitials(match.volunteer.userId?.name)}
                  </div>
                  <div className="match-info">
                    <h3>{match.volunteer.userId?.name}</h3>
                    <p>{match.volunteer.location?.area || 'Area not set'}</p>
                    <div className="match-skills">
                      {match.volunteer.skills?.map((s, i) => (
                        <span key={i} className="skill-tag">{s}</span>
                      ))}
                    </div>
                    <p className="match-reasoning">🤖 {match.reasoning}</p>
                  </div>
                  <div className="match-score-section">
                    <div
                      className="match-score"
                      style={{ color: getScoreColor(match.matchScore) }}
                    >
                      {match.matchScore}%
                    </div>
                    <p className="match-score-label">match</p>
                    <button
                      className="btn-assign"
                      onClick={() => handleAssign(match.volunteer._id)}
                      disabled={assigning === match.volunteer._id}
                    >
                      {assigning === match.volunteer._id
                        ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Tasks = () => {
  const { isAdmin, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => { fetchTasks() }, [])

  useEffect(() => {
    let result = tasks
    if (filter !== 'all') {
      result = result.filter(t => t.status === filter)
    }
    setFiltered(result)
  }, [tasks, filter])

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks')
      setTasks(res.data.tasks || [])
    } catch (error) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status })
      toast.success('Status updated!')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  return (
    <Layout>
      <div className="tasks-page">
        <div className="tasks-header">
          <h1>Tasks</h1>
          <p>Track and manage all community service tasks</p>
        </div>

        <div className="tasks-toolbar">
          <div className="filter-tabs">
            {['all', 'open', 'assigned', 'in_progress', 'completed', 'cancelled'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.replace('_', ' ').charAt(0).toUpperCase() +
                  f.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="tasks-stats">
          {[
            { label: 'Total', value: tasks.length, color: '#185fa5' },
            {
              label: 'Open',
              value: tasks.filter(t => t.status === 'open').length,
              color: '#888'
            },
            {
              label: 'In Progress',
              value: tasks.filter(t => t.status === 'in_progress').length,
              color: '#854f0b'
            },
            {
              label: 'Completed',
              value: tasks.filter(t => t.status === 'completed').length,
              color: '#3b6d11'
            }
          ].map(stat => (
            <div key={stat.label} className="tstat">
              <span className="tstat-num" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="tstat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found.</p>
            <p>Create tasks from Community Needs page.</p>
          </div>
        ) : (
          <div className="tasks-list">
            {filtered.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-left">
                  <div className="task-badges">
                    <UrgencyBadge urgency={task.urgency} />
                    <StatusBadge status={task.status} />
                  </div>
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && (
                    <p className="task-desc">{task.description}</p>
                  )}
                  <div className="task-meta">
                    <span>📍 {task.area}</span>
                    {task.requiredSkills?.length > 0 && (
                      <span>🎯 {task.requiredSkills.join(', ')}</span>
                    )}
                    <span>
                      📅 {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {task.assignedTo && (
                    <p className="task-assigned">
                      👤 Assigned to:{' '}
                      <strong>
                        {task.assignedTo.userId?.name || 'Volunteer'}
                      </strong>
                    </p>
                  )}
                </div>

                <div className="task-right">
                  {isAdmin() && task.status === 'open' && (
                    <button
                      className="btn-match"
                      onClick={() => setSelectedTask(task)}
                    >
                      🤖 Find Volunteer
                    </button>
                  )}
                  {task.status === 'assigned' && (
                    <button
                      className="btn-progress"
                      onClick={() =>
                        handleStatusUpdate(task._id, 'in_progress')
                      }
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === 'in_progress' && (
                    <button
                      className="btn-complete"
                      onClick={() =>
                        handleStatusUpdate(task._id, 'completed')
                      }
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <AIMatchModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onAssigned={fetchTasks}
        />
      )}
    </Layout>
  )
}

export default Tasks