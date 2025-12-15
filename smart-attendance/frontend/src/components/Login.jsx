import { useState } from 'react'
import axios from 'axios'

function Login({ onLogin, apiBaseUrl }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/login`, {
        email,
        password
      })

      const { token, user } = response.data
      onLogin(user, token)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Smart Attendance System</h2>
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
          <p>Demo Credentials:</p>
          <p>Employee: emp@example.com / password</p>
          <p>Admin: admin@example.com / password</p>
        </div>
      </form>
    </div>
  )
}

export default Login
