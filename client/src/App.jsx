import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadSurvey from './pages/UploadSurvey'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import CommunityNeeds from './pages/CommunityNeeds'
import Volunteers from './pages/Volunteers'
import Tasks from './pages/Tasks'

const ComingSoon = ({ title }) => (
  <Layout>
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2 style={{ color: '#185fa5' }}>{title}</h2>
      <p style={{ color: '#888', marginTop: '8px' }}>
        This page is coming soon — we're building it next!
      </p>
    </div>
  </Layout>
)

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/upload" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UploadSurvey />
        </ProtectedRoute>
      } />
      <Route path="/needs" element={
  <ProtectedRoute>
    <CommunityNeeds />
  </ProtectedRoute>
} />
      <Route path="/volunteers" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <Volunteers />
  </ProtectedRoute>
} />
      <Route path="/tasks" element={
  <ProtectedRoute>
    <Tasks />
  </ProtectedRoute>
} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App