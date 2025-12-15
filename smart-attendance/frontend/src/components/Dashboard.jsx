import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard({ user, apiBaseUrl }) {
  const [activeTab, setActiveTab] = useState('attendance')
  const [attendanceData, setAttendanceData] = useState(null)
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [leaveForm, setLeaveForm] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  })

  useEffect(() => {
    fetchAttendanceData()
    fetchLeaveRequests()
  }, [])

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${apiBaseUrl}/api/attendance/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAttendanceData(response.data)
    } catch (err) {
      console.error('Error fetching attendance data:', err)
    }
  }

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${apiBaseUrl}/api/leaves/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLeaveRequests(response.data)
    } catch (err) {
      console.error('Error fetching leave requests:', err)
    }
  }

  const handleCheckIn = async () => {
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${apiBaseUrl}/api/attendance/check-in`,
        { user_id: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage({ type: 'success', text: 'Checked in successfully!' })
      fetchAttendanceData()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Check-in failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${apiBaseUrl}/api/attendance/check-out`,
        { user_id: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage({ type: 'success', text: 'Checked out successfully!' })
      fetchAttendanceData()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Check-out failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${apiBaseUrl}/api/leaves/request`,
        {
          user_id: user.id,
          ...leaveForm
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage({ type: 'success', text: 'Leave request submitted successfully!' })
      setLeaveForm({ start_date: '', end_date: '', reason: '' })
      fetchLeaveRequests()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Leave request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container dashboard">
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          Leave Requests
        </button>
      </div>

      {activeTab === 'attendance' && (
        <div className="tab-content active">
          <div className="dashboard-grid">
            <div className="card">
              <h3>Today's Attendance</h3>
              {attendanceData ? (
                <>
                  <div className="status-item">
                    <label>Check-in Time</label>
                    <div className="value">
                      {attendanceData.check_in ? new Date(attendanceData.check_in).toLocaleTimeString() : 'Not checked in'}
                    </div>
                  </div>
                  <div className="status-item">
                    <label>Check-out Time</label>
                    <div className="value">
                      {attendanceData.check_out ? new Date(attendanceData.check_out).toLocaleTimeString() : 'Not checked out'}
                    </div>
                  </div>
                  <div className="btn-group">
                    <button
                      className="btn-primary"
                      onClick={handleCheckIn}
                      disabled={loading || attendanceData.check_in}
                    >
                      Check In
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={handleCheckOut}
                      disabled={loading || !attendanceData.check_in || attendanceData.check_out}
                    >
                      Check Out
                    </button>
                  </div>
                </>
              ) : (
                <p>Loading attendance data...</p>
              )}
            </div>

            <div className="card">
              <h3>Attendance Summary</h3>
              <div className="status-item">
                <label>Total Present Days</label>
                <div className="value">0</div>
              </div>
              <div className="status-item">
                <label>Total Absent Days</label>
                <div className="value">0</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="tab-content active">
          <div className="dashboard-grid">
            <div className="card">
              <h3>Request Leave</h3>
              <form onSubmit={handleLeaveSubmit}>
                <div className="form-group">
                  <label htmlFor="start_date">Start Date</label>
                  <input
                    id="start_date"
                    type="date"
                    value={leaveForm.start_date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="end_date">End Date</label>
                  <input
                    id="end_date"
                    type="date"
                    value={leaveForm.end_date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reason">Reason</label>
                  <textarea
                    id="reason"
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
                  />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>

            <div className="card">
              <h3>My Leave Requests</h3>
              {leaveRequests.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((leave) => (
                      <tr key={leave.id}>
                        <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                        <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge badge-${leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No leave requests yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
