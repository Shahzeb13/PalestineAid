import React, { useState } from 'react';
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
  // Determine phase
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
        <div style={{margin: '24px 0'}}>
          <QRCode value={window.location.origin + '/tracking?trackingId=' + donation.id} size={120} fgColor="#6366f1" bgColor="#f7fafc" />
          <div style={{fontSize: 12, color: '#6b7280', marginTop: 8}}>Scan to track this donation</div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500, margin: '0 auto'}}>
        {phases.map((label, idx) => (
          <div key={label} style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: phaseStates[idx] ? 'linear-gradient(135deg, #34d399 0%, #059669 100%)' : '#e5e7eb',
              color: phaseStates[idx] ? '#fff' : '#6b7280',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18,
              border: idx === currentPhase ? '3px solid #6366f1' : '2px solid #e5e7eb',
              transition: 'all 0.3s',
            }}>{phaseStates[idx] ? '✓' : idx + 1}</div>
            <span style={{fontWeight: idx === currentPhase ? 700 : 500, color: idx === currentPhase ? '#6366f1' : '#374151'}}>{label}</span>
            {idx < phases.length - 1 && <div style={{flex: 1, height: 2, background: phaseStates[idx] ? 'linear-gradient(90deg, #34d399 0%, #059669 100%)' : '#e5e7eb', marginLeft: 8, marginRight: 8}}></div>}
          </div>
        ))}
      </div>
      {/* Analytics Section */}
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

  // Support prefill from query param
  React.useEffect(() => {
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
    setDonation(null);
    setDonations([]);
    try {
      if (mode === 'id') {
        const res = await axios.get(`http://localhost:5000/api/donater/donation/${trackingId}`);
        if (res.data.success) {
          setDonation(res.data.donation);
        } else {
          setError(res.data.message || 'Donation not found');
        }
      } else {
        const res = await axios.get(`http://localhost:5000/api/donater/donations-by-email?email=${encodeURIComponent(email)}`);
        if (res.data.success) {
          setDonations(res.data.donations);
          setDonation(res.data.donations[0]); // Show latest by default
        } else {
          setError(res.data.message || 'No donations found for this email');
        }
      }
    } catch (err) {
      setError('Donation not found or server error');
    } finally {
      setLoading(false);
    }
  };

  // Auto-track if trackingId is prefilled
  React.useEffect(() => {
    if (mode === 'id' && trackingId) handleTrack();
    // eslint-disable-next-line
  }, [trackingId]);

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', padding: '2rem'}}>
      <style>{`
        .tracking-toggle-btn {
          min-width: 140px;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1.1rem;
          border: 2px solid #6366f1;
          margin: 0 4px;
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
        }
        .tracking-toggle-btn.primary {
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(99,102,241,0.10);
        }
        .tracking-toggle-btn.secondary {
          background: #f3f4f6;
          color: #374151;
          border-color: #d1d5db;
        }
        .tracking-toggle-btn.primary:focus, .tracking-toggle-btn.secondary:focus {
          outline: 2px solid #6366f1;
        }
      `}</style>
      <div style={{maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)', padding: '2rem', marginTop: 48}}>
        <h1 style={{textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 16, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Track Your Donation</h1>
        {/* Toggle for ID vs Email */}
        <div style={{display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24}}>
          <button onClick={() => { setMode('id'); setDonation(null); setDonations([]); setError(''); }} className={`tracking-toggle-btn ${mode === 'id' ? 'primary' : 'secondary'}`}>Track by ID</button>
          <button onClick={() => { setMode('email'); setDonation(null); setDonations([]); setError(''); }} className={`tracking-toggle-btn ${mode === 'email' ? 'primary' : 'secondary'}`}>Track by Email</button>
        </div>
        <form onSubmit={handleTrack} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {mode === 'id' ? (
            <>
              <label htmlFor="trackingId" style={{fontWeight: 600}}>Enter Tracking ID</label>
              <input
                id="trackingId"
                type="text"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="e.g. 65f1c2a4b7e1a2c3d4e5f6a7"
                style={{padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16}}
                required
              />
            </>
          ) : (
            <>
              <label htmlFor="email" style={{fontWeight: 600}}>Enter Donor Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. donor@email.com"
                style={{padding: '12px 16px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16}}
                required
              />
            </>
          )}
          <button type="submit" style={{background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginTop: 8}} disabled={loading}>
            {loading ? 'Tracking...' : (mode === 'id' ? 'Track Donation' : 'Find Donations')}
          </button>
        </form>
        {error && <div style={{color: '#ef4444', marginTop: 16, textAlign: 'center'}}>{error}</div>}
        {/* If tracking by email and multiple donations, show a list to pick from */}
        {mode === 'email' && donations.length > 1 && (
          <div style={{margin: '24px 0'}}>
            <h3 style={{fontWeight: 600, color: '#6366f1', marginBottom: 8}}>Select a Donation to Track</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              {donations.map(d => (
                <button key={d.id} onClick={() => setDonation(d)} style={{textAlign: 'left', background: donation && donation.id === d.id ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' : '#f3f4f6', color: donation && donation.id === d.id ? '#fff' : '#374151', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 500, fontSize: 16, cursor: 'pointer'}}>
                  {d.request?.requestName || 'Donation'} — ${d.amount} — {new Date(d.date).toLocaleDateString()}
                </button>
              ))}
            </div>
          </div>
        )}
        {donation && <DonationTracker donation={donation} />}
      </div>
    </div>
  );
};

export default TrackingPage; 