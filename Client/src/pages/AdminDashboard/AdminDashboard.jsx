import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './AdminDashboard.css';
import ChatbotToggle from '../../Components/chatbot/ChatbotToggle';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');
  const [completingPaymentId, setCompletingPaymentId] = useState(null);
  const [activePaymentsTab, setActivePaymentsTab] = useState('pending');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [totalCompletedAmount, setTotalCompletedAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentNotes, setPaymentNotes] = useState('');

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

  // Fetch pending admin-to-NGO payments
  const fetchPendingPayments = async () => {
    setPaymentsLoading(true);
    setPaymentsError('');
    try {
      const res = await axios.get('http://localhost:5000/api/admin-payments/pending-payments', { withCredentials: true });
      if (res.data.success) {
        setPendingPayments(res.data.payments);
      } else {
        setPaymentsError(res.data.message || 'Failed to fetch payments');
      }
    } catch (err) {
      setPaymentsError('Failed to fetch payments');
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Fetch admin payment history
  const fetchPaymentHistory = async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await axios.get('http://localhost:5000/api/admin-payments/payment-history', { withCredentials: true });
      if (res.data.success) {
        setPaymentHistory(res.data.payments);
      } else {
        setHistoryError(res.data.message || 'Failed to fetch payment history');
      }
    } catch (err) {
      setHistoryError('Failed to fetch payment history');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Open modal and fetch payments
  const handleOpenPaymentsModal = () => {
    setShowPaymentsModal(true);
    setActivePaymentsTab('pending');
    fetchPendingPayments();
    fetchPaymentHistory();
  };

  // Open payment modal for a specific payment
  const openPaymentModal = (payment) => {
    setSelectedPayment(payment);
    setPaymentMethod('bank_transfer');
    setPaymentNotes('');
    setShowPaymentModal(true);
  };

  // Confirm send to NGO
  const confirmSendToNGO = async () => {
    if (!selectedPayment) return;
    setCompletingPaymentId(selectedPayment.id);
    try {
      const res = await axios.post('http://localhost:5000/api/admin-payments/complete-payment', {
        donationId: selectedPayment.id,
        paymentMethod,
        notes: paymentNotes,
      }, { withCredentials: true });
      if (res.data.success) {
        showNotification('Payment sent to NGO');
        fetchPendingPayments();
        fetchPaymentHistory();
        setShowPaymentModal(false);
        setSelectedPayment(null);
      } else {
        showNotification(res.data.message || 'Failed to complete payment', 'error');
      }
    } catch (err) {
      showNotification('Failed to complete payment', 'error');
    } finally {
      setCompletingPaymentId(null);
    }
  };

  // Update summary stats when payments change
  useEffect(() => {
    setTotalPendingAmount(pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0));
  }, [pendingPayments]);
  useEffect(() => {
    setTotalCompletedAmount(paymentHistory.reduce((sum, p) => sum + (p.amount || 0), 0));
  }, [paymentHistory]);

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
        <button className="btn view" style={{marginTop: '1rem'}} onClick={handleOpenPaymentsModal}>
          Admin to NGO Payments
        </button>
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

      {/* Admin to NGO Payments Modal */}
      {showPaymentsModal && (
        <div className="modal" onClick={() => setShowPaymentsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: 900}}>
            <div className="modal-header">
              <h2>Admin to NGO Payments</h2>
              <button onClick={() => setShowPaymentsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* Flashy Summary Section */}
              <div style={{
                display: 'flex',
                gap: 24,
                marginBottom: 32,
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'stretch',
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)',
                  color: '#fff',
                  borderRadius: 16,
                  padding: '1.5rem 2.5rem',
                  minWidth: 220,
                  boxShadow: '0 6px 24px rgba(251,191,36,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'fadeIn 1s',
                }}>
                  <span style={{fontSize: 36, marginBottom: 8, filter: 'drop-shadow(0 2px 6px #f59e42)'}}>💸</span>
                  <span style={{fontSize: 32, fontWeight: 700, letterSpacing: 1}}>{pendingPayments.length}</span>
                  <span style={{fontSize: 16, fontWeight: 500, opacity: 0.9}}>Pending Payments</span>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                  color: '#fff',
                  borderRadius: 16,
                  padding: '1.5rem 2.5rem',
                  minWidth: 220,
                  boxShadow: '0 6px 24px rgba(52,211,153,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'fadeIn 1.2s',
                }}>
                  <span style={{fontSize: 36, marginBottom: 8, filter: 'drop-shadow(0 2px 6px #059669)'}}>💰</span>
                  <span style={{fontSize: 32, fontWeight: 700, letterSpacing: 1}}>
                    ${totalPendingAmount.toLocaleString()}
                  </span>
                  <span style={{fontSize: 16, fontWeight: 500, opacity: 0.9}}>Total Pending Amount</span>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                  color: '#fff',
                  borderRadius: 16,
                  padding: '1.5rem 2.5rem',
                  minWidth: 220,
                  boxShadow: '0 6px 24px rgba(99,102,241,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'fadeIn 1.4s',
                }}>
                  <span style={{fontSize: 36, marginBottom: 8, filter: 'drop-shadow(0 2px 6px #6366f1)'}}>🎉</span>
                  <span style={{fontSize: 32, fontWeight: 700, letterSpacing: 1}}>{paymentHistory.length}</span>
                  <span style={{fontSize: 16, fontWeight: 500, opacity: 0.9}}>Completed Payments</span>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #f43f5e 0%, #f87171 100%)',
                  color: '#fff',
                  borderRadius: 16,
                  padding: '1.5rem 2.5rem',
                  minWidth: 220,
                  boxShadow: '0 6px 24px rgba(244,63,94,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'fadeIn 1.6s',
                }}>
                  <span style={{fontSize: 36, marginBottom: 8, filter: 'drop-shadow(0 2px 6px #f43f5e)'}}>🏆</span>
                  <span style={{fontSize: 32, fontWeight: 700, letterSpacing: 1}}>
                    ${totalCompletedAmount.toLocaleString()}
                  </span>
                  <span style={{fontSize: 16, fontWeight: 500, opacity: 0.9}}>Total Completed Amount</span>
                </div>
              </div>
              {/* Tabs */}
              <div style={{display: 'flex', gap: 16, marginBottom: 24}}>
                <button
                  className={`btn view${activePaymentsTab === 'pending' ? ' active' : ''}`}
                  style={{fontWeight: activePaymentsTab === 'pending' ? 'bold' : 'normal'}}
                  onClick={() => setActivePaymentsTab('pending')}
                >
                  Pending Payments
                </button>
                <button
                  className={`btn view${activePaymentsTab === 'history' ? ' active' : ''}`}
                  style={{fontWeight: activePaymentsTab === 'history' ? 'bold' : 'normal'}}
                  onClick={() => setActivePaymentsTab('history')}
                >
                  Payment History
                </button>
              </div>
              {/* Tab Content */}
              {activePaymentsTab === 'pending' ? (
                paymentsLoading ? (
                  <div className="loading"><div className="spinner"></div><p>Loading payments...</p></div>
                ) : paymentsError ? (
                  <div className="error"><p>{paymentsError}</p></div>
                ) : pendingPayments.length === 0 ? (
                  <div className="no-requests"><p>No pending payments to NGOs.</p></div>
                ) : (
                  <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr style={{background: '#f3f4f6'}}>
                          <th style={{padding: '8px'}}>Amount</th>
                          <th style={{padding: '8px'}}>Currency</th>
                          <th style={{padding: '8px'}}>Date</th>
                          <th style={{padding: '8px'}}>Donor</th>
                          <th style={{padding: '8px'}}>Request</th>
                          <th style={{padding: '8px'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingPayments.map(payment => (
                          <tr key={payment.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                            <td style={{padding: '8px'}}>{payment.amount}</td>
                            <td style={{padding: '8px'}}>{payment.currency}</td>
                            <td style={{padding: '8px'}}>{new Date(payment.date).toLocaleDateString()}</td>
                            <td style={{padding: '8px'}}>{payment.donor?.name || 'N/A'}</td>
                            <td style={{padding: '8px'}}>{payment.request?.requestName || 'N/A'}</td>
                            <td style={{padding: '8px'}}>
                              <button 
                                className="btn approve"
                                onClick={() => openPaymentModal(payment)}
                              >
                                Send to NGO
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                historyLoading ? (
                  <div className="loading"><div className="spinner"></div><p>Loading payment history...</p></div>
                ) : historyError ? (
                  <div className="error"><p>{historyError}</p></div>
                ) : paymentHistory.length === 0 ? (
                  <div className="no-requests"><p>No payment history found.</p></div>
                ) : (
                  <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr style={{background: '#f3f4f6'}}>
                          <th style={{padding: '8px'}}>Amount</th>
                          <th style={{padding: '8px'}}>Currency</th>
                          <th style={{padding: '8px'}}>Date</th>
                          <th style={{padding: '8px'}}>Donor</th>
                          <th style={{padding: '8px'}}>Request</th>
                          <th style={{padding: '8px'}}>Payment Method</th>
                          <th style={{padding: '8px'}}>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map(payment => (
                          <tr key={payment.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                            <td style={{padding: '8px'}}>{payment.amount}</td>
                            <td style={{padding: '8px'}}>{payment.currency}</td>
                            <td style={{padding: '8px'}}>{payment.adminPaymentDate ? new Date(payment.adminPaymentDate).toLocaleDateString() : 'N/A'}</td>
                            <td style={{padding: '8px'}}>{payment.donor?.name || 'N/A'}</td>
                            <td style={{padding: '8px'}}>{payment.request?.requestName || 'N/A'}</td>
                            <td style={{padding: '8px'}}>{payment.adminPaymentMethod || 'N/A'}</td>
                            <td style={{padding: '8px'}}>{payment.adminPaymentNotes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="modal" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: 400}}>
            <div className="modal-header">
              <h3>Send Payment to NGO</h3>
              <button onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{marginBottom: 16}}>
                <label style={{fontWeight: 600}}>Payment Method:</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{width: '100%', padding: 8, marginTop: 4}}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{marginBottom: 16}}>
                <label style={{fontWeight: 600}}>Notes (optional):</label>
                <textarea value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} style={{width: '100%', padding: 8, minHeight: 60, marginTop: 4}} placeholder="Add any notes about this payment..." />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12}}>
                <button className="btn" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                <button className="btn approve" onClick={confirmSendToNGO} disabled={completingPaymentId === (selectedPayment && selectedPayment.id)}>
                  {completingPaymentId === (selectedPayment && selectedPayment.id) ? 'Processing...' : 'Confirm Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <ChatbotToggle />
    </div>
  );
};

export default AdminDashboard; 