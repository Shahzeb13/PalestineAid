import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './DonaterDashboard.css';

// Load Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

// Donation Form Component
const DonationForm = ({ request, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Debug: Log the request data
      console.log('Request data being sent:', {
        requestId: request.requestId?._id,
        amount: parseFloat(amount) * 100,
        currency: 'usd',
        message: message,
        fullRequest: request
      });

      // Validate requestId exists
      if (!request.requestId?._id) {
        throw new Error('Invalid request data. Please try again.');
      }

      // Validate amount
      const amountInCents = parseFloat(amount) * 100;
      if (amountInCents < 50) { // Minimum 50 cents
        throw new Error('Minimum donation amount is $0.50');
      }

      // Create payment intent
      const paymentIntentResponse = await axios.post(
        'http://localhost:5000/api/stripe/create-donation-payment-intent',
        {
          requestId: request.requestId._id,
          amount: amountInCents,
          currency: 'usd',
          message: message
        },
        { withCredentials: true }
      );

      console.log('Payment intent response:', paymentIntentResponse.data);

      if (!paymentIntentResponse.data.success) {
        throw new Error(paymentIntentResponse.data.message);
      }

      const { clientSecret } = paymentIntentResponse.data;

      if (!clientSecret) {
        throw new Error('Payment intent creation failed. Please try again.');
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.name || 'Anonymous Donor',
            email: user?.email
          }
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm donation on backend
        const confirmResponse = await axios.post(
          'http://localhost:5000/api/stripe/confirm-donation',
          {
            paymentIntentId: paymentIntent.id,
            requestId: request.requestId._id,
            amount: amountInCents,
            currency: 'usd',
            message: message
          },
          { withCredentials: true }
        );

        if (confirmResponse.data.success) {
          onSuccess(confirmResponse.data.donation);
        } else {
          throw new Error(confirmResponse.data.message);
        }
      }
    } catch (err) {
      console.error('Donation error:', err);
      console.error('Error response:', err.response?.data);
      
      // More specific error messages
      if (err.response?.status === 500) {
        setError('Server error. Please check your Stripe configuration and try again.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid request data.');
      } else if (err.response?.status === 403) {
        setError('You are not authorized to make donations.');
      } else if (err.response?.status === 404) {
        setError('Request not found or not confirmed.');
      } else {
        setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="donation-modal">
      <div className="donation-content">
        <div className="donation-header">
          <h2>💝 Make a Donation</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="donation-body">
          <div className="request-summary">
            <h3>{request.requestId?.requestName || 'Request'}</h3>
            <p>{request.requestId?.requestDescription || 'No description available'}</p>
            <div className="request-meta">
              <span>👤 {request.userId?.name || 'Unknown User'}</span>
              <span>📍 {request.requestId?.location || 'Location not specified'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="donation-form">
            <div className="form-group">
              <label htmlFor="amount">Donation Amount (USD)</label>
              <div className="amount-input">
                <span className="currency">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a message of support..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Card Information</label>
              <div className="card-element-container">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="donation-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn cancel"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn donate"
                disabled={!stripe || loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Processing...
                  </>
                ) : (
                  `Donate $${amount || '0.00'}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DonaterDashboard = () => {
  const { user } = useAuth();
  const [confirmedRequests, setConfirmedRequests] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donatingRequest, setDonatingRequest] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fetch confirmed requests
  useEffect(() => {
    if (!user) return;
    const fetchConfirmedRequests = async () => {
      setLoading(true);
      try {
        console.log('Fetching confirmed requests...');
        const res = await axios.get('http://localhost:5000/api/donater/confirmedRequests', 
          { withCredentials: true }
        );
        console.log('Confirmed requests response:', res.data);
        if (res.data.success) {
          setConfirmedRequests(res.data.requests);
        }
      } catch (err) {
        console.error('Error fetching confirmed requests:', err);
        setError('Failed to load confirmed requests');
        showNotification('Failed to load confirmed requests', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmedRequests();
  }, [user]);

  // Fetch donation history
  useEffect(() => {
    if (!user) return;
    const fetchDonationHistory = async () => {
      try {
        console.log('Fetching donation history...');
        const res = await axios.get('http://localhost:5000/api/donater/donationHistory', 
          { withCredentials: true }
        );
        console.log('Donation history response:', res.data);
        if (res.data.success) {
          setDonationHistory(res.data.donations || []);
        }
      } catch (err) {
        console.error('Error fetching donation history:', err);
        showNotification('Failed to load donation history', 'error');
      }
    };
    fetchDonationHistory();
  }, [user]);

  // Get single request details
  const handleViewDetails = async (requestId) => {
    try {
      console.log('Fetching request details for:', requestId);
      const res = await axios.get(`http://localhost:5000/api/donater/request/${requestId}`, 
        { withCredentials: true }
      );
      console.log('Request details response:', res.data);
      if (res.data.success) {
        setSelectedRequest(res.data.request);
      }
    } catch (err) {
      console.error('Error fetching request details:', err);
      showNotification('Failed to load request details', 'error');
    }
  };

  // Handle donation success
  const handleDonationSuccess = (donation) => {
    showNotification(`Successfully donated $${(donation.amount / 100).toFixed(2)}! Thank you for your generosity.`);
    setShowDonationModal(false);
    setDonatingRequest(null);
    // Refresh donation history
    // You might want to refresh the donation history here
  };

  // Open donation modal
  const handleDonate = (request) => {
    setDonatingRequest(request);
    setShowDonationModal(true);
  };

  if (loading) {
    return (
      <div className="donater-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="donater-dashboard">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donater-dashboard">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: '', type: 'success' })}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header">
        <h1>Donater Dashboard</h1>
        <p>Help those in need by donating to confirmed requests</p>
      </div>

      {/* Statistics */}
      <div className="stats">
        <div className="stat-card">
          <h3>{confirmedRequests.length}</h3>
          <p>Available Requests</p>
        </div>
        <div className="stat-card">
          <h3>{donationHistory.length}</h3>
          <p>Your Donations</p>
        </div>
        <div className="stat-card">
          <h3>${donationHistory.reduce((total, donation) => total + (donation.amount || 0), 0) / 100}</h3>
          <p>Total Donated</p>
        </div>
        <div className="stat-card">
          <h3>{new Set(donationHistory.map(d => d.requestId)).size}</h3>
          <p>People Helped</p>
        </div>
      </div>

      {/* Confirmed Requests Section */}
      <div className="requests-section">
        <h2>Available Requests for Donation</h2>
        <div className="requests-grid">
          {confirmedRequests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <h3>{request.requestId?.requestName || 'No name available'}</h3>
                <span className="status confirmed">
                  Confirmed
                </span>
              </div>
              
              <div className="request-info">
                <p>{request.requestId?.requestDescription || 'No description available'}</p>
                <div className="request-details">
                  <span>👤 {request.userId?.name || 'Unknown User'}</span>
                  <span>📍 {request.requestId?.location || 'Location not specified'}</span>
                  <span>🎯 {request.requestId?.requestType || 'Type not specified'}</span>
                  <span>⚡ {request.requestId?.urgencyLevel || 'Urgency not specified'}</span>
                </div>
                <div className="request-meta">
                  <span>📅 Deadline: {request.requestId?.deadline ? new Date(request.requestId.deadline).toLocaleDateString() : 'No deadline'}</span>
                  <span>✅ Approved by: {request.adminId?.name || 'Unknown Admin'}</span>
                </div>
              </div>

              <div className="request-actions">
                <button 
                  onClick={() => handleViewDetails(request.requestId?._id)} 
                  className="btn view"
                  disabled={!request.requestId?._id}
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleDonate(request)}
                  className="btn donate"
                >
                  Donate Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {confirmedRequests.length === 0 && (
          <div className="no-requests">
            <p>No confirmed requests available for donation at the moment.</p>
            <p>Check back later for new opportunities to help!</p>
          </div>
        )}
      </div>

      {/* Donation History Section */}
      {donationHistory.length > 0 && (
        <div className="history-section">
          <h2>Your Donation History</h2>
          <div className="history-grid">
            {donationHistory.map((donation) => (
              <div key={donation._id} className="history-card">
                <div className="history-header">
                  <h3>{donation.requestName || 'Unknown Request'}</h3>
                  <span className="amount">${(donation.amount / 100).toFixed(2)}</span>
                </div>
                <div className="history-details">
                  <span>📅 {donation.date ? new Date(donation.date).toLocaleDateString() : 'Date not available'}</span>
                  <span>👤 {donation.receiverName || 'Unknown Receiver'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <strong>Request Name:</strong> {selectedRequest?.requestName || 'No name available'}
              </div>
              <div className="detail-row">
                <strong>Description:</strong> {selectedRequest?.requestDescription || 'No description available'}
              </div>
              <div className="detail-row">
                <strong>Requester:</strong> {selectedRequest?.receiver?.name || 'Unknown'}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {selectedRequest?.receiver?.email || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Location:</strong> {selectedRequest?.location || 'Location not specified'}
              </div>
              <div className="detail-row">
                <strong>Type:</strong> {selectedRequest?.requestType || 'Type not specified'}
              </div>
              <div className="detail-row">
                <strong>Urgency:</strong> {selectedRequest?.urgencyLevel || 'Urgency not specified'}
              </div>
              <div className="detail-row">
                <strong>Role:</strong> {selectedRequest?.role || 'Role not specified'}
              </div>
              <div className="detail-row">
                <strong>Date:</strong> {selectedRequest?.date ? new Date(selectedRequest.date).toLocaleDateString() : 'Date not available'}
              </div>
              <div className="detail-row">
                <strong>Deadline:</strong> {selectedRequest?.deadline ? new Date(selectedRequest.deadline).toLocaleDateString() : 'Deadline not available'}
              </div>
              <div className="detail-row">
                <strong>Admin Approval:</strong> 
                <span className="status confirmed">
                  {selectedRequest?.adminApproval?.approvalStatus || 'Unknown'}
                </span>
              </div>
              <div className="detail-row">
                <strong>Approved by:</strong> {selectedRequest?.adminApproval?.adminName || 'Unknown Admin'}
              </div>
              {selectedRequest?.proofImage && (
                <div className="detail-row">
                  <strong>Proof Image:</strong>
                  <a href={selectedRequest.proofImage} target="_blank" rel="noopener noreferrer">
                    View Image
                  </a>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => {
                  setSelectedRequest(null);
                  handleDonate(donatingRequest);
                }}
                className="btn donate"
              >
                Donate Now
              </button>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="btn cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Donation Modal */}
      {showDonationModal && donatingRequest && (
        <Elements stripe={stripePromise}>
          <DonationForm
            request={donatingRequest}
            onSuccess={handleDonationSuccess}
            onClose={() => {
              setShowDonationModal(false);
              setDonatingRequest(null);
            }}
          />
        </Elements>
      )}
    </div>
  );
};

export default DonaterDashboard; 