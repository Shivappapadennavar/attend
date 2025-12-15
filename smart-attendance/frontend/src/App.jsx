import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'

const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:8000`

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <nav className="navbar">
            <h1>Smart Attendance & Leave Management</h1>
            <div>
              <span style={{ marginRight: '1rem' }}>Welcome, {user?.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </nav>
          {user?.role === 'admin' ? (
            <AdminPanel user={user} apiBaseUrl={API_BASE_URL} />
          ) : (
            <Dashboard user={user} apiBaseUrl={API_BASE_URL} />
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} apiBaseUrl={API_BASE_URL} />
      )}
    </>
  )
}

export default App
