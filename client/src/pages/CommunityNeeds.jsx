import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'
import './CommunityNeeds.css'

const UrgencyBadge = ({ urgency }) => (
  <span className={`badge badge-${urgency}`}>{urgency}</span>
)

const CreateTaskModal = ({ survey, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: survey.extractedData?.issue || '',
    description: '',
    area: survey.extractedData?.area || '',
    urgency: survey.extractedData?.urgency || 'medium',
    requiredSkills: ''
  })

  const handleSubmit = async () => {
    if (!formData.title || !formData.area) {
      toast.error('Title and area are required')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/tasks', {
        ...formData,
        requiredSkills: formData.requiredSkills
          ? formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        surveyRef: survey._id
      })
      toast.success('Task created successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create Task from Survey</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <div className="form-field">
            <label className="form-label">Task Title</label>
            <input
              className="form-input"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="Task title"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              value={formData.description}
              onChange={e => setFormData(p => ({
                ...p, description: e.target.value
              }))}
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Area</label>
            <input
              className="form-input"
              value={formData.area}
              onChange={e => setFormData(p => ({ ...p, area: e.target.value }))}
              placeholder="Area"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Urgency</label>
            <select
              className="form-input"
              value={formData.urgency}
              onChange={e => setFormData(p => ({
                ...p, urgency: e.target.value
              }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Required Skills (comma separated)</label>
            <input
              className="form-input"
              value={formData.requiredSkills}
              onChange={e => setFormData(p => ({
                ...p, requiredSkills: e.target.value
              }))}
              placeholder="e.g. Medical, Driving"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

const CommunityNeeds = () => {
  const { isAdmin } = useAuth()
  const [surveys, setSurveys] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedSurvey, setSelectedSurvey] = useState(null)

  useEffect(() => { fetchSurveys() }, [])

  useEffect(() => {
    let result = surveys
    if (filter !== 'all') {
      result = result.filter(s => s.extractedData?.urgency === filter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.extractedData?.issue?.toLowerCase().includes(q) ||
        s.extractedData?.area?.toLowerCase().includes(q) ||
        s.extractedData?.name?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [surveys, filter, search])

  const fetchSurveys = async () => {
    try {
      const res = await api.get('/api/surveys')
      setSurveys(res.data.surveys || [])
    } catch (error) {
      toast.error('Failed to fetch community needs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="needs-page">
        <div className="needs-header">
          <h1>Community Needs</h1>
          <p>All reported community needs sorted by urgency</p>
        </div>

        <div className="needs-toolbar">
          <input
            type="text"
            placeholder="Search by issue, area or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="filter-tabs">
            {['all', 'critical', 'high', 'medium', 'low'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No community needs found.</p>
          </div>
        ) : (
          <div className="needs-grid">
            {filtered.map(survey => (
              <div key={survey._id} className="need-item">
                <div className="need-item-header">
                  <UrgencyBadge urgency={survey.extractedData?.urgency || 'medium'} />
                  <span className="need-score">
                    AI: {survey.aiUrgencyScore || 0}/100
                  </span>
                </div>
                <h3 className="need-title">
                  {survey.extractedData?.issue || 'No issue specified'}
                </h3>
                <p className="need-area">
                  {survey.extractedData?.area || 'Area not specified'}
                </p>
                <div className="need-details">
                  <span>👤 {survey.extractedData?.name || 'Unknown'}</span>
                  {survey.extractedData?.familySize && (
                    <span>👨‍👩‍👧 Family of {survey.extractedData.familySize}</span>
                  )}
                </div>
                {survey.aiAnalysis?.reasoning && (
                  <p className="ai-reasoning-text">
                    🤖 {survey.aiAnalysis.reasoning}
                  </p>
                )}
                <div className="need-item-footer">
                  <span className={`status-pill status-${survey.status}`}>
                    {survey.status}
                  </span>
                  {isAdmin() && survey.status === 'pending' && (
                    <button
                      className="btn-create-task"
                      onClick={() => setSelectedSurvey(survey)}
                    >
                      Create Task
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSurvey && (
        <CreateTaskModal
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
          onSuccess={fetchSurveys}
        />
      )}
    </Layout>
  )
}

export default CommunityNeeds