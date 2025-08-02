import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecieverDashboard.css';
import ChatbotToggle from '../../Components/chatbot/ChatbotToggle';

const RecieverDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, requestId: null, requestName: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    requestName: '',
    requestDescription: '',
    date: '',
    location: '',
    urgencyLevel: 'Medium',
    requestType: 'Medical',
    recieverRole: 'Individual',
    deadline: '',
    proofImage: ''
  });

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  // Hide notification function
  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  // 1. Get user info from backend using the httpOnly cookie
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/auth/is-auth', { withCredentials: true });
        console.log('Auth response:', res.data);
        setUserId(res.data.user.id);
      } catch (err) {
        console.error('Auth error:', err.response?.data || err.message);
        setError('You must be logged in to view the dashboard.');
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 2. Fetch dashboard data using userId
  useEffect(() => {
    if (!userId) return;
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/recieverDashboard/getRecieverDashboardData/${userId}`, { withCredentials: true });
        setData(res.data.data);
        // Show welcome notification on first load
        if (res.data.data.totalRequests === 0) {
          setNotification({ show: true, message: '👋 Welcome to your dashboard! Create your first aid request to get started.', type: 'success' });
          setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
          }, 8000); // Longer duration for welcome message
        }
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [userId]);

  // Send Aid Request
  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...requestForm,
        userId: userId
      };
      const res = await axios.post('http://localhost:5000/api/recieverDashboard/sendAidRequest', requestData, { withCredentials: true });
      if (res.data.success) {
        setShowRequestForm(false);
        setRequestForm({
          requestName: '',
          requestDescription: '',
          date: '',
          location: '',
          urgencyLevel: 'Medium',
          requestType: 'Medical',
          recieverRole: 'Individual',
          deadline: '',
          proofImage: ''
        });
        showNotification('🎉 Aid request sent successfully! Your request has been submitted and is now pending review.');
        // Refresh dashboard data after a short delay to show the notification
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send request. Please try again.';
      showNotification(errorMessage, 'error');
    }
  };

  // Update Request
  const handleUpdateRequest = async (requestId, updatedData) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/recieverDashboard/updateRequest/${requestId}`, updatedData, { withCredentials: true });
      if (res.data.success) {
        setSelectedRequest(null);
        showNotification('✅ Request updated successfully!');
        // Refresh dashboard data after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update request. Please try again.';
      showNotification(errorMessage, 'error');
    }
  };

  // Show Delete Confirmation
  const showDeleteConfirmation = (requestId, requestName) => {
    setShowDeleteConfirm({ show: true, requestId, requestName });
  };

  // Hide Delete Confirmation
  const hideDeleteConfirmation = () => {
    setShowDeleteConfirm({ show: false, requestId: null, requestName: '' });
    setIsDeleting(false);
  };

  // Delete Request
  const handleDeleteRequest = async () => {
    const { requestId } = showDeleteConfirm;
    setIsDeleting(true);
    try {
      const res = await axios.delete(`http://localhost:5000/api/recieverDashboard/deleteRequest/${requestId}`, { withCredentials: true });
      if (res.data.success) {
        hideDeleteConfirmation();
        showNotification('🗑️ Request deleted successfully!');
        // Refresh dashboard data after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete request. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get Single Request Data
  const handleViewRequest = async (requestId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recieverDashboard/getSingleRequestData/${requestId}`, { withCredentials: true });
      if (res.data.success) {
        setSelectedRequest(res.data.request);
      }
    } catch (err) {
      setError('Failed to load request details.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <h3>Access Denied</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Notification Component */}
      {notification.show && (
        <div className={`notification ${notification.type} ${notification.message.includes('Welcome') ? 'welcome' : ''}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button onClick={hideNotification} className="notification-close">×</button>
          </div>
        </div>
      )}
      
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Track your aid requests and their status</p>
        <button 
          className="action-button primary"
          onClick={() => setShowRequestForm(true)}
        >
          + New Aid Request
        </button>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{data.totalRequests}</h3>
            <p>Total Requests</p>
          </div>
        </div>

        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{data.approvedRequests.length}</h3>
            <p>Approved</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{data.pendingRequests.length}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{data.rejectedRequests.length}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Request Lists */}
      <div className="dashboard-requests-section">
        <div className="requests-grid">
          {/* Pending Requests */}
          <div className="requests-card">
            <h3>Pending Requests</h3>
            <div className="requests-list">
              {data.pendingRequests.map((request) => (
                <div key={request._id} className="request-item">
                  <div className="request-info">
                    <h4>{request.requestName}</h4>
                    <p>{request.requestDescription}</p>
                    <span className="request-location">📍 {request.location}</span>
                  </div>
                  <div className="request-actions">
                    <button onClick={() => handleViewRequest(request._id)} className="action-button small">
                      View
                    </button>
                    <button onClick={() => showDeleteConfirmation(request._id, request.requestName)} className="action-button small danger">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {data.pendingRequests.length === 0 && (
                <p className="no-requests">No pending requests</p>
              )}
            </div>
          </div>

          {/* Approved Requests */}
          <div className="requests-card">
            <h3>Approved Requests</h3>
            <div className="requests-list">
              {data.approvedRequests.map((request) => (
                <div key={request._id} className="request-item">
                  <div className="request-info">
                    <h4>{request.requestName}</h4>
                    <p>{request.requestDescription}</p>
                    <span className="request-location">📍 {request.location}</span>
                  </div>
                  <div className="request-actions">
                    <button onClick={() => handleViewRequest(request._id)} className="action-button small">
                      View
                    </button>
                  </div>
                </div>
              ))}
              {data.approvedRequests.length === 0 && (
                <p className="no-requests">No approved requests</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-latest-section">
        <div className="latest-card">
          <div className="latest-header">
            <h2>Latest Request</h2>
            <div className={`status-badge ${data.currentStatus.toLowerCase()}`}>
              {data.currentStatus}
            </div>
          </div>
          <div className="latest-content">
            <div className="info-row">
              <span className="label">Status:</span>
              <span className="value">{data.currentStatus}</span>
            </div>
            <div className="info-row">
              <span className="label">Delivery Location:</span>
              <span className="value">{data.deliveryLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Request Form Modal */}
      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>New Aid Request</h2>
              <button onClick={() => setShowRequestForm(false)} className="close-button">×</button>
            </div>
            <form onSubmit={handleSendRequest} className="request-form">
              <div className="form-group">
                <label>Request Name</label>
                <input
                  type="text"
                  value={requestForm.requestName}
                  onChange={(e) => setRequestForm({...requestForm, requestName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={requestForm.requestDescription}
                  onChange={(e) => setRequestForm({...requestForm, requestDescription: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={requestForm.date}
                    onChange={(e) => setRequestForm({...requestForm, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={requestForm.deadline}
                    onChange={(e) => setRequestForm({...requestForm, deadline: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={requestForm.location}
                  onChange={(e) => setRequestForm({...requestForm, location: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Urgency Level</label>
                  <select
                    value={requestForm.urgencyLevel}
                    onChange={(e) => setRequestForm({...requestForm, urgencyLevel: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Request Type</label>
                  <select
                    value={requestForm.requestType}
                    onChange={(e) => setRequestForm({...requestForm, requestType: e.target.value})}
                  >
                    <option value="Medical">Medical</option>
                    <option value="Food">Food</option>
                    <option value="Shelter">Shelter</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Money">Money</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Receiver Role</label>
                  <select
                    value={requestForm.recieverRole}
                    onChange={(e) => setRequestForm({...requestForm, recieverRole: e.target.value})}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Family">Family</option>
                    <option value="Organization">Organization</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Proof Image URL</label>
                <input
                  type="url"
                  value={requestForm.proofImage}
                  onChange={(e) => setRequestForm({...requestForm, proofImage: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowRequestForm(false)} className="action-button secondary">
                  Cancel
                </button>
                <button type="submit" className="action-button primary">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Request Details</h2>
              <button onClick={() => setSelectedRequest(null)} className="close-button">×</button>
            </div>
            <div className="request-details">
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{selectedRequest.requestName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Description:</span>
                <span className="value">{selectedRequest.requestDescription}</span>
              </div>
              <div className="detail-row">
                <span className="label">Location:</span>
                <span className="value">{selectedRequest.location}</span>
              </div>
              <div className="detail-row">
                <span className="label">Urgency:</span>
                <span className="value">{selectedRequest.urgencyLevel}</span>
              </div>
              <div className="detail-row">
                <span className="label">Type:</span>
                <span className="value">{selectedRequest.requestType}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`status-badge ${selectedRequest.status?.toLowerCase()}`}>
                  {selectedRequest.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">{new Date(selectedRequest.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Deadline:</span>
                <span className="value">{new Date(selectedRequest.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.show && (
        <div className="modal-overlay" onClick={hideDeleteConfirmation}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <button onClick={hideDeleteConfirmation} className="confirm-close-button">×</button>
              <div className="confirm-icon">🗑️</div>
              <h2>Delete Request</h2>
            </div>
            <div className="confirm-content">
              <p>Are you sure you want to delete this request?</p>
              <div className="confirm-request-info">
                <strong>{showDeleteConfirm.requestName}</strong>
              </div>
              <p className="confirm-warning">
                This action cannot be undone. The request will be permanently removed.
              </p>
            </div>
            <div className="confirm-actions">
              <button onClick={hideDeleteConfirmation} className="action-button secondary" disabled={isDeleting}>
                Cancel
              </button>
              <button onClick={handleDeleteRequest} className="action-button danger" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <ChatbotToggle />
    </div>
  );
};

export default RecieverDashboard; 