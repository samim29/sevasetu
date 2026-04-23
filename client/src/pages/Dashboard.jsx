import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import api from '../services/api'
import './Dashboard.css'

const StatCard = ({ number, label, color }) => (
  <div className="stat-card">
    <div className="stat-number" style={{ color }}>{number}</div>
    <div className="stat-label">{label}</div>
  </div>
)

const UrgencyBadge = ({ urgency }) => (
  <span className={`badge badge-${urgency}`}>
    {urgency}
  </span>
)

const Dashboard = () => {
  const { user } = useAuth()
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    resolved: 0
  })

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const res = await api.get('/api/surveys')
      const data = res.data.surveys || []
      setSurveys(data)
      setStats({
        total: data.length,
        critical: data.filter(s =>
          s.extractedData?.urgency === 'critical'
        ).length,
        high: data.filter(s =>
          s.extractedData?.urgency === 'high'
        ).length,
        resolved: data.filter(s =>
          s.status === 'resolved'
        ).length
      })
    } catch (error) {
      console.error('Failed to fetch surveys:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's what's happening in your community today.</p>
        </div>

        <div className="stats-grid">
          <StatCard
            number={stats.total}
            label="Total Surveys"
            color="#185fa5"
          />
          <StatCard
            number={stats.critical}
            label="Critical Needs"
            color="#e24b4a"
          />
          <StatCard
            number={stats.high}
            label="High Priority"
            color="#ba7517"
          />
          <StatCard
            number={stats.resolved}
            label="Resolved"
            color="#3b6d11"
          />
        </div>

        <div className="dashboard-section">
          <h2>Recent Community Needs</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : surveys.length === 0 ? (
            <div className="empty-state">
              <p>No surveys uploaded yet.</p>
              <p>Upload a survey to get started!</p>
            </div>
          ) : (
            <div className="needs-list">
              {surveys.slice(0, 10).map(survey => (
                <div key={survey._id} className="need-card">
                  <div className="need-info">
                    <p className="need-issue">
                      {survey.extractedData?.issue || 'No issue specified'}
                    </p>
                    <p className="need-area">
                      {survey.extractedData?.area || 'Area not specified'}
                    </p>
                    <p className="need-meta">
                      Reported by: {survey.uploadedBy?.name} •{' '}
                      {new Date(survey.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="need-right">
                    <UrgencyBadge
                      urgency={survey.extractedData?.urgency || 'medium'}
                    />
                    <span className={`status-badge status-${survey.status}`}>
                      {survey.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard