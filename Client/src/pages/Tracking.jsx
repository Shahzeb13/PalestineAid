import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const phases = [
  'Donor Paid',
  'Admin Received',
  'Admin Forwarded to NGO',
  'NGO Helping in Need',
];

const DonationTracker = ({ donation }) => {
  if (!donation) return null;

  // Handle donation intents differently
  if (donation.isIntent) {
    return (
      <div style={{marginTop: 32, marginBottom: 32}}>
        <div style={{marginBottom: 24, textAlign: 'center'}}>
          <div style={{background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 12, padding: 16, marginBottom: 16}}>
            <h3 style={{color: '#92400e', margin: '0 0 8px 0'}}>🎁 Donation Intent</h3>
            <p style={{color: '#92400e', margin: 0, fontSize: 14}}>This is a pending donation intent that needs to be completed</p>
          </div>
          
          <strong>Intent ID:</strong> {donation.id}<br/>
          <strong>Amount:</strong> ${donation.amount}<br/>
          <strong>Status:</strong> {donation.status}<br/>
          <strong>Created:</strong> {new Date(donation.date).toLocaleDateString()}<br/>
          {donation.expiresAt && (
            <>
              <strong>Expires:</strong> {new Date(donation.expiresAt).toLocaleDateString()}<br/>
            </>
          )}
          {donation.message && (
            <>
              <strong>Message:</strong> {donation.message}<br/>
            </>
          )}
          
          <div style={{margin: '24px 0'}}>
            <QRCode value={window.location.origin + '/tracking?trackingId=' + donation.id} size={120} fgColor="#f59e0b" bgColor="#fef3c7" />
            <div style={{fontSize: 12, color: '#92400e', marginTop: 8}}>Scan to track this intent</div>
          </div>
        </div>

        <div style={{background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 12, padding: 20, textAlign: 'center'}}>
          <h4 style={{color: '#92400e', margin: '0 0 12px 0'}}>Next Steps</h4>
          <p style={{color: '#92400e', margin: 0, fontSize: 14}}>
            To complete this donation, please sign in to your account or register if you haven't already.
          </p>
        </div>
      </div>
    );
  }

  // Determine phase for actual donations
  const phaseStates = [
    donation.paymentStatus === 'completed',
    donation.paymentStatus === 'completed',
    donation.adminPaymentStatus === 'completed',
    donation.adminPaymentStatus === 'completed',
  ];
  
  let currentPhase = 0;
  if (donation.adminPaymentStatus === 'completed') currentPhase = 3;
  else if (donation.paymentStatus === 'completed') currentPhase = 1;
  else currentPhase = 0;

  // Analytics data
  const statusPieData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [
          donation.adminPaymentStatus === 'completed' ? 1 : 0,
          donation.adminPaymentStatus !== 'completed' ? 1 : 0,
        ],
        backgroundColor: ['#34d399', '#fbbf24'],
        borderWidth: 0,
      },
    ],
  };
  
  const amountBarData = {
    labels: phases,
    datasets: [
      {
        label: 'Amount ($)',
        data: [
          donation.amount,
          donation.paymentStatus === 'completed' ? donation.amount : 0,
          donation.adminPaymentStatus === 'completed' ? donation.amount : 0,
          donation.adminPaymentStatus === 'completed' ? donation.amount : 0,
        ],
        backgroundColor: [
          '#6366f1',
          '#34d399',
          '#fbbf24',
          '#f43f5e',
        ],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div style={{marginTop: 32, marginBottom: 32}}>
      <div style={{marginBottom: 24, textAlign: 'center'}}>
        <strong>Donation ID:</strong> {donation.id}<br/>
        <strong>Amount:</strong> ${donation.amount}<br/>
        <strong>Request:</strong> {donation.request?.requestName || 'N/A'}<br/>
        <strong>Status:</strong> {donation.status}<br/>
        <strong>Payment Status:</strong> {donation.paymentStatus}<br/>
        <strong>Admin Payment Status:</strong> {donation.adminPaymentStatus}<br/>
        <strong>Date:</strong> {new Date(donation.date).toLocaleDateString()}<br/>
                 {donation.message && (
           <>
             <strong>Message:</strong> {donation.message}<br/>
           </>
         )}
        
        <div style={{margin: '24px 0'}}>
          <QRCode value={window.location.origin + '/tracking?trackingId=' + donation.id} size={120} fgColor="#6366f1" bgColor="#f7fafc" />
          <div style={{fontSize: 12, color: '#6b7280', marginTop: 8}}>Scan to track this donation</div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div style={{marginBottom: 40, background: '#f9fafb', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(99,102,241,0.07)', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto'}}>
        <h3 style={{textAlign: 'center', color: '#6366f1', fontWeight: 700, marginBottom: 24}}>Donation Progress</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {phases.map((phase, idx) => (
            <div key={phase} style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: phaseStates[idx] ? 'linear-gradient(135deg, #34d399 0%, #059669 100%)' : '#e5e7eb',
                color: phaseStates[idx] ? '#fff' : '#6b7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 700, fontSize: 16,
                border: idx === currentPhase ? '3px solid #6366f1' : '2px solid #e5e7eb',
                transition: 'all 0.3s',
              }}>
                {phaseStates[idx] ? '✓' : idx + 1}
              </div>
              <span style={{
                fontWeight: idx === currentPhase ? 700 : 500, 
                color: idx === currentPhase ? '#6366f1' : '#374151',
                fontSize: 16
              }}>
                {phase}
              </span>
              {idx < phases.length - 1 && (
                <div style={{
                  flex: 1, height: 2, 
                  background: phaseStates[idx] ? 'linear-gradient(90deg, #34d399 0%, #059669 100%)' : '#e5e7eb', 
                  marginLeft: 8, marginRight: 8
                }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Analytics */}
      <div style={{marginTop: 40, background: '#f9fafb', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(99,102,241,0.07)', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto'}}>
        <h3 style={{textAlign: 'center', color: '#6366f1', fontWeight: 700, marginBottom: 16}}>Donation Analytics</h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center'}}>
          <div style={{width: 180, height: 180, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(52,211,153,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Pie data={statusPieData} options={{ plugins: { legend: { display: false } } }} />
            <div style={{fontSize: 14, color: '#374151', marginTop: 8}}>Completion</div>
          </div>
          <div style={{width: 260, height: 180, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(244,63,94,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Bar data={amountBarData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
            <div style={{fontSize: 14, color: '#374151', marginTop: 8}}>Amount by Phase</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingPage = () => {
  const [mode, setMode] = useState('id'); // 'id' or 'email'
  const [trackingId, setTrackingId] = useState('');
  const [email, setEmail] = useState('');
  const [donation, setDonation] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Support prefill from query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('trackingId');
    if (id) {
      setTrackingId(id);
      setMode('id');
    }
  }, []);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setDonation(null);
    setDonations([]);
    
    try {
      if (mode === 'id') {
        const res = await axios.get(`http://localhost:5000/api/donater/donation/${trackingId}`);
        if (res.data.success) {
          setDonation(res.data.donation);
          setSuccess('Donation found successfully!');
        } else {
          setError(res.data.message || 'Donation not found');
        }
      } else {
        const res = await axios.get(`http://localhost:5000/api/donater/donations-by-email?email=${encodeURIComponent(email)}`);
        if (res.data.success) {
          setDonations(res.data.donations);
          setDonation(res.data.donations[0]); // Show latest by default
          setSuccess(res.data.message);
        } else {
          setError(res.data.message || 'No donations found for this email');
        }
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.response?.data?.message || 'Failed to track donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-track if trackingId is prefilled
  useEffect(() => {
    if (mode === 'id' && trackingId) handleTrack();
    // eslint-disable-next-line
  }, [trackingId]);

  const resetForm = () => {
    setTrackingId('');
    setEmail('');
    setDonation(null);
    setDonations([]);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px'}}>
      <div style={{maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '2rem', marginTop: 48}}>
        <h1 style={{textAlign: 'center', fontWeight: 800, fontSize: 32, marginBottom: 8, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Track Your Donation
        </h1>
        <p style={{textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 32}}>
          Monitor the progress of your humanitarian contributions
        </p>

        {/* Toggle for ID vs Email */}
        <div style={{display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32}}>
          <button 
            onClick={() => { setMode('id'); resetForm(); }} 
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: mode === 'id' ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' : '#f3f4f6',
              color: mode === 'id' ? '#fff' : '#374151',
              boxShadow: mode === 'id' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
            }}
          >
            🔍 Track by ID
          </button>
          <button 
            onClick={() => { setMode('email'); resetForm(); }} 
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: mode === 'email' ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' : '#f3f4f6',
              color: mode === 'email' ? '#fff' : '#374151',
              boxShadow: mode === 'email' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
            }}
          >
            📧 Track by Email
          </button>
        </div>

        <form onSubmit={handleTrack} style={{display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32}}>
          {mode === 'id' ? (
            <div>
              <label htmlFor="trackingId" style={{fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block'}}>
                Enter Tracking ID
              </label>
              <input
                id="trackingId"
                type="text"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="e.g. 65f1c2a4b7e1a2c3d4e5f6a7"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 12,
                  border: '2px solid #e5e7eb',
                  fontSize: 16,
                  transition: 'all 0.3s',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="email" style={{fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block'}}>
                Enter Donor Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. donor@email.com"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 12,
                  border: '2px solid #e5e7eb',
                  fontSize: 16,
                  transition: 'all 0.3s',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          )}
          
          <button 
            type="submit" 
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '16px 0',
              fontWeight: 700,
              fontSize: 18,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
            }} 
            disabled={loading}
          >
            {loading ? (
              <span>🔍 Tracking...</span>
            ) : (
              <span>{mode === 'id' ? 'Track Donation' : 'Find Donations'}</span>
            )}
          </button>
        </form>

        {/* Success/Error Messages */}
        {success && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            textAlign: 'center',
            color: '#065f46'
          }}>
            ✅ {success}
          </div>
        )}
        
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            textAlign: 'center',
            color: '#991b1b'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Donation Selection (for email mode) */}
        {mode === 'email' && donations.length > 1 && (
          <div style={{marginBottom: 32}}>
            <h3 style={{fontWeight: 700, color: '#6366f1', marginBottom: 16, textAlign: 'center'}}>
              Select a Donation to Track ({donations.length} found)
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              {donations.map((d, index) => (
                <button 
                  key={d.id} 
                  onClick={() => setDonation(d)} 
                  style={{
                    textAlign: 'left',
                    background: donation && donation.id === d.id ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' : '#f9fafb',
                    color: donation && donation.id === d.id ? '#fff' : '#374151',
                    border: donation && donation.id === d.id ? 'none' : '2px solid #e5e7eb',
                    borderRadius: 12,
                    padding: '16px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{fontWeight: 700, marginBottom: 4}}>
                      {d.isIntent ? '🎁 Donation Intent' : '💝 Donation'} #{index + 1}
                    </div>
                    <div style={{fontSize: 14, opacity: 0.8}}>
                      {d.request?.requestName || 'General Donation'} — ${d.amount} — {new Date(d.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{fontSize: 12, opacity: 0.7}}>
                    {d.isIntent ? 'Intent' : 'Donation'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Donation Tracker */}
        {donation && <DonationTracker donation={donation} />}
      </div>
    </div>
  );
};

export default TrackingPage; 