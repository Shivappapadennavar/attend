import { useState, useEffect } from 'react'
import axios from 'axios'

function AdminPanel({ user, apiBaseUrl }) {
  const [activeTab, setActiveTab] = useState('leaves')
  const [leaveRequests, setLeaveRequests] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchLeaveRequests()
    fetchAttendanceRecords()
    fetchUsers()
  }, [])

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${apiBaseUrl}/api/leaves/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLeaveRequests(response.data)
    } catch (err) {
      console.error('Error fetching leave requests:', err)
    }
  }

  const fetchAttendanceRecords = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${apiBaseUrl}/api/attendance/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAttendanceRecords(response.data)
    } catch (err) {
      console.error('Error fetching attendance records:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${apiBaseUrl}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const handleApproveLeave = async (leaveId) => {
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${apiBaseUrl}/api/leaves/approve/${leaveId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage({ type: 'success', text: 'Leave approved successfully!' })
      fetchLeaveRequests()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Approval failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleRejectLeave = async (leaveId) => {
    setLoading(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${apiBaseUrl}/api/leaves/reject/${leaveId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage({ type: 'success', text: 'Leave rejected successfully!' })
      fetchLeaveRequests()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Rejection failed' })
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
          className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          Leave Approvals
        </button>
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance Records
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {activeTab === 'leaves' && (
        <div className="tab-content active">
          <div className="card">
            <h3>Pending Leave Requests</h3>
            {leaveRequests.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.user_name}</td>
                      <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                      <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                      <td>{leave.reason}</td>
                      <td>
                        <button
                          className="btn-primary"
                          onClick={() => handleApproveLeave(leave.id)}
                          disabled={loading}
                          style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleRejectLeave(leave.id)}
                          disabled={loading}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pending leave requests.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="tab-content active">
          <div className="card">
            <h3>Attendance Records</h3>
            {attendanceRecords.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.user_name}</td>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.check_in ? new Date(record.check_in).toLocaleTimeString() : '-'}</td>
                      <td>{record.check_out ? new Date(record.check_out).toLocaleTimeString() : '-'}</td>
                      <td>
                        <span className={`badge badge-${record.check_in && record.check_out ? 'success' : record.check_in ? 'warning' : 'danger'}`}>
                          {record.check_in && record.check_out ? 'Present' : record.check_in ? 'Checked In' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendance records.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="tab-content active">
          <div className="card">
            <h3>All Users</h3>
            {users.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge badge-${u.role === 'admin' ? 'danger' : 'info'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
