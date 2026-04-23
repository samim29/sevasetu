import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logoutUser, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">SevaSetu</Link>
      </div>
      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        {isAdmin() && (
          <Link
            to="/upload"
            className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
          >
            Upload Survey
          </Link>
        )}
        <Link
          to="/needs"
          className={`nav-link ${isActive('/needs') ? 'active' : ''}`}
        >
          Community Needs
        </Link>
        {isAdmin() && (
          <Link
            to="/volunteers"
            className={`nav-link ${isActive('/volunteers') ? 'active' : ''}`}
          >
            Volunteers
          </Link>
        )}
        <Link
          to="/tasks"
          className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
        >
          Tasks
        </Link>
      </div>
      <div className="navbar-user">
        <span className="user-name">{user?.name}</span>
        <span className={`user-role ${user?.role}`}>{user?.role}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar