import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'
import './Volunteers.css'

const AvailabilityBadge = ({ status }) => (
  <span className={`avail-badge avail-${status}`}>{status}</span>
)

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchVolunteers() }, [])

  useEffect(() => {
    let result = volunteers
    if (filter !== 'all') {
      result = result.filter(v => v.availability === filter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(v =>
        v.userId?.name?.toLowerCase().includes(q) ||
        v.location?.area?.toLowerCase().includes(q) ||
        v.skills?.some(s => s.toLowerCase().includes(q))
      )
    }
    setFiltered(result)
  }, [volunteers, filter, search])

  const fetchVolunteers = async () => {
    try {
      const res = await api.get('/api/volunteers')
      setVolunteers(res.data.volunteers || [])
    } catch (error) {
      toast.error('Failed to fetch volunteers')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'V'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const avatarColors = [
    '#185fa5', '#3b6d11', '#854f0b',
    '#a32d2d', '#533ab7', '#0f6e56'
  ]

  const getAvatarColor = (name) => {
    if (!name) return avatarColors[0]
    const index = name.charCodeAt(0) % avatarColors.length
    return avatarColors[index]
  }

  return (
    <Layout>
      <div className="volunteers-page">
        <div className="volunteers-header">
          <h1>Volunteers</h1>
          <p>All registered volunteers and their availability</p>
        </div>

        <div className="volunteers-toolbar">
          <input
            type="text"
            placeholder="Search by name, area or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="filter-tabs">
            {['all', 'available', 'busy', 'unavailable'].map(f => (
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

        <div className="volunteers-stats">
          <div className="vstat">
            <span className="vstat-num">
              {volunteers.length}
            </span>
            <span className="vstat-label">Total</span>
          </div>
          <div className="vstat">
            <span className="vstat-num" style={{ color: '#3b6d11' }}>
              {volunteers.filter(v => v.availability === 'available').length}
            </span>
            <span className="vstat-label">Available</span>
          </div>
          <div className="vstat">
            <span className="vstat-num" style={{ color: '#854f0b' }}>
              {volunteers.filter(v => v.availability === 'busy').length}
            </span>
            <span className="vstat-label">Busy</span>
          </div>
          <div className="vstat">
            <span className="vstat-num" style={{ color: '#a32d2d' }}>
              {volunteers.filter(v => v.availability === 'unavailable').length}
            </span>
            <span className="vstat-label">Unavailable</span>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No volunteers found.</p>
            <p>Volunteers will appear here after they register.</p>
          </div>
        ) : (
          <div className="volunteers-grid">
            {filtered.map(volunteer => (
              <div key={volunteer._id} className="volunteer-card">
                <div className="volunteer-top">
                  <div
                    className="volunteer-avatar"
                    style={{
                      backgroundColor: getAvatarColor(volunteer.userId?.name)
                    }}
                  >
                    {getInitials(volunteer.userId?.name)}
                  </div>
                  <div className="volunteer-info">
                    <h3>{volunteer.userId?.name || 'Unknown'}</h3>
                    <p>{volunteer.userId?.email || ''}</p>
                  </div>
                  <AvailabilityBadge status={volunteer.availability} />
                </div>

                <div className="volunteer-details">
                  <div className="detail-row">
                    <span className="detail-label">📍 Area</span>
                    <span className="detail-value">
                      {volunteer.location?.area || 'Not specified'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">✅ Tasks</span>
                    <span className="detail-value">
                      {volunteer.tasksCompleted} completed
                    </span>
                  </div>
                </div>

                {volunteer.skills?.length > 0 && (
                  <div className="skills-list">
                    {volunteer.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                )}

                <div className="volunteer-footer">
                  <span className="joined-date">
                    Joined {new Date(volunteer.userId?.createdAt)
                      .toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Volunteers