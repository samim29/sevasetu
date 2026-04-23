import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const { loginUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'volunteer',
    skills: '',
    area: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name || formData.name.length < 2)
      newErrors.name = 'Name must be at least 2 characters'
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = 'Enter a valid email'
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'
    if (formData.role === 'volunteer' && !formData.area)
      newErrors.area = 'Area is required for volunteers'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        area: formData.area,
        skills: formData.skills
          ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
          : []
      }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        payload
      )
      loginUser(res.data.user, res.data.token)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">SevaSetu</h1>
        <p className="register-subtitle">Create your account</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              className={`form-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <div className="form-field">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>
          <div className="form-field">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="volunteer">Volunteer</option>
              <option value="admin">NGO Admin</option>
            </select>
          </div>
          {formData.role === 'volunteer' && (
            <>
              <div className="form-field">
                <label className="form-label">Area / Locality</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Tangra, Kolkata"
                  className={`form-input ${errors.area ? 'error' : ''}`}
                />
                {errors.area && <p className="form-error">{errors.area}</p>}
              </div>
              <div className="form-field">
                <label className="form-label">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. Medical, Driving, Teaching"
                  className="form-input"
                />
                <p className="form-hint">Separate multiple skills with commas</p>
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="register-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register