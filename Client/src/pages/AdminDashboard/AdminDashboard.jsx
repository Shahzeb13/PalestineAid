import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fetch all requests
  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      setLoading(true);
      try {
        console.log('Fetching requests for admin...');
        const res = await axios.get('http://localhost:5000/api/adminDashboard/getRequestsList', 
          { withCredentials: true }
        );
        console.log('Admin requests response:', res.data);
        if (res.data.success) {
          setRequests(res.data.requests);
        }
      } catch (err) {
        console.error('Error fetching admin requests:', err);
        setError('Failed to load requests');
        showNotification('Failed to load requests', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  // Get single request details
  const handleViewDetails = async (requestId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/adminDashboard/getSingleRequestDetails/${requestId}`, 
        { withCredentials: true }
      );
      if (res.data.success) {
        setSelectedRequest(res.data.data);
      }
    } catch (err) {
      showNotification('Failed to load request details', 'error');
    }
  };

  // Approve or reject request
  const handleAction = async (requestId, action) => {
    try {
      console.log(`Attempting to ${action} request:`, requestId);
      const res = await axios.post(`http://localhost:5000/api/adminDashboard/approveRequest/${requestId}`, 
        { action }, 
        { withCredentials: true }
      );
      console.log('Action response:', res.data);
      if (res.data.success) {
        showNotification(`Request ${action}d successfully`);
        // Refresh requests
        const updatedRes = await axios.get('http://localhost:5000/api/adminDashboard/getRequestsList', 
          { withCredentials: true }
        );
        if (updatedRes.data.success) {
          setRequests(updatedRes.data.requests);
        }
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      showNotification(err.response?.data?.message || `Failed to ${action} request`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: '', type: 'success' })}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage aid requests</p>
      </div>

      {/* Statistics */}
      <div className="stats">
        <div className="stat-card">
          <h3>{requests.length}</h3>
          <p>Total Requests</p>
        </div>
        <div className="stat-card">
          <h3>{requests.filter(r => r.status === 'Pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{requests.filter(r => r.status === 'Confirmed').length}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-card">
          <h3>{requests.filter(r => r.status === 'Rejected').length}</h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* Requests List */}
      <div className="requests-section">
        <h2>All Requests</h2>
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <h3>{request.requestName}</h3>
                <span className={`status ${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>
              
              <div className="request-info">
                <p>{request.requestDescription}</p>
                <div className="request-details">
                  <span>👤 {request.recieverId?.name || 'Unknown'}</span>
                  <span>📍 {request.location}</span>
                  <span>🎯 {request.requestType}</span>
                  <span>⚡ {request.urgencyLevel}</span>
                </div>
              </div>

              <div className="request-actions">
                <button 
                  onClick={() => handleViewDetails(request._id)} 
                  className="btn view"
                >
                  View Details
                </button>
                {request.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleAction(request._id, 'approve')}
                      className="btn approve"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(request._id, 'reject')}
                      className="btn reject"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="no-requests">
            <p>No requests found</p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="modal" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Details</h2>
              <button onClick={() => setSelectedRequest(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <strong>Name:</strong> {selectedRequest.requestName}
              </div>
              <div className="detail-row">
                <strong>Description:</strong> {selectedRequest.requestDescription}
              </div>
              <div className="detail-row">
                <strong>Requester:</strong> {selectedRequest.recieverId?.name || 'Unknown'}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {selectedRequest.recieverId?.email || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Location:</strong> {selectedRequest.location}
              </div>
              <div className="detail-row">
                <strong>Type:</strong> {selectedRequest.requestType}
              </div>
              <div className="detail-row">
                <strong>Urgency:</strong> {selectedRequest.urgencyLevel}
              </div>
              <div className="detail-row">
                <strong>Role:</strong> {selectedRequest.recieverRole}
              </div>
              <div className="detail-row">
                <strong>Date:</strong> {new Date(selectedRequest.date).toLocaleDateString()}
              </div>
              <div className="detail-row">
                <strong>Deadline:</strong> {new Date(selectedRequest.deadline).toLocaleDateString()}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> 
                <span className={`status ${selectedRequest.status?.toLowerCase()}`}>
                  {selectedRequest.status}
                </span>
              </div>
              {selectedRequest.proofImage && (
                <div className="detail-row">
                  <strong>Proof Image:</strong>
                  <a href={selectedRequest.proofImage} target="_blank" rel="noopener noreferrer">
                    View Image
                  </a>
                </div>
              )}
            </div>

            {selectedRequest.status === 'Pending' && (
              <div className="modal-actions">
                <button 
                  onClick={() => handleAction(selectedRequest._id, 'approve')}
                  className="btn approve"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(selectedRequest._id, 'reject')}
                  className="btn reject"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 