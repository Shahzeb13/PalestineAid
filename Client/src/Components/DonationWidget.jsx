import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DonationWidget = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donationData, setDonationData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save donation intent to backend
      const response = await fetch('http://localhost:5000/api/donation-intent/save-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          message,
          email,
          currency: 'usd'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setDonationData({
          amount: parseFloat(amount),
          message,
          email,
          timestamp: new Date().toISOString(),
          intentId: data.donationIntent.id
        });
        setShowAuthPrompt(true);
      } else {
        alert('Failed to save donation intent: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving donation intent:', error);
      alert('Failed to save donation intent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setMessage('');
    setEmail('');
    setShowAuthPrompt(false);
    setDonationData(null);
  };

  if (showAuthPrompt) {
    return (
      <div style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(16,185,129,0.15)', padding: 32, maxWidth: 500, margin: '0 auto', marginTop: 32, textAlign: 'center'}}>
        <div style={{fontSize: 48, marginBottom: 16}}>🎉</div>
        <h2 style={{color: '#fff', fontWeight: 800, fontSize: 24, marginBottom: 8}}>Donation Details Saved!</h2>
        <p style={{color: '#fff', fontSize: 16, marginBottom: 24, opacity: 0.9}}>Amount: ${donationData?.amount} | Message: {donationData?.message}</p>
        <p style={{color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 24}}>Please sign in or register to complete your donation</p>
        <div style={{display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/login" style={{background: '#fff', color: '#059669', borderRadius: 8, padding: '12px 24px', fontWeight: 700, textDecoration: 'none', fontSize: 16, boxShadow: '0 2px 8px rgba(255,255,255,0.2)'}}>Sign In</Link>
          <Link to="/register" style={{background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, padding: '12px 24px', fontWeight: 700, textDecoration: 'none', fontSize: 16, border: '2px solid rgba(255,255,255,0.3)'}}>Register</Link>
        </div>
        <button onClick={resetForm} style={{background: 'none', border: 'none', color: '#fff', marginTop: 16, fontSize: 14, textDecoration: 'underline', cursor: 'pointer'}}>Start Over</button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(120deg, #f43f5e 60%, #e11d48 100%)',
      borderRadius: 32,
      padding: '3.5rem 3rem 2.5rem 3rem',
      maxWidth: 900,
      width: '100%',
      margin: '0 auto 40px auto',
      boxShadow: '0 8px 32px rgba(244,63,94,0.18)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s',
    }}>
      <div style={{textAlign: 'center', marginBottom: 24}}>
        <div style={{fontSize: 48, marginBottom: 16}}>💝</div>
        <h2 style={{color: '#fff', fontWeight: 800, fontSize: 28, marginBottom: 8}}>Make a Difference Today</h2>
        <p style={{color: '#fff', fontSize: 16, opacity: 0.9}}>Your donation can help provide food, shelter, and medical aid to those in need</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        <div>
          <label htmlFor="amount" style={{color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block'}}>Donation Amount (USD)</label>
          <div style={{position: 'relative'}}>
            <span style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#f43f5e', fontWeight: 700, fontSize: 18}}>$</span>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="1"
              step="0.01"
              required
              style={{width: '100%', padding: '12px 12px 12px 32px', borderRadius: 8, border: 'none', fontSize: 18, fontWeight: 600, boxSizing: 'border-box'}}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="message" style={{color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block'}}>Message (Optional)</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message of hope and support..."
            rows="3"
            style={{width: '100%', padding: 12, borderRadius: 8, border: 'none', fontSize: 16, resize: 'vertical', boxSizing: 'border-box'}}
          />
        </div>
        
        <div>
          <label htmlFor="email" style={{color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 8, display: 'block'}}>Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{width: '100%', padding: 12, borderRadius: 8, border: 'none', fontSize: 16, boxSizing: 'border-box'}}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#fff',
            color: '#e11d48',
            border: 'none',
            borderRadius: 8,
            padding: '16px 0',
            fontWeight: 700,
            fontSize: 18,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s'
          }}
        >
          {loading ? (
            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
              <div style={{width: 16, height: 16, border: '2px solid #e11d48', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
              Processing...
            </span>
          ) : (
            `Donate $${amount || '0.00'}`
          )}
        </button>
      </form>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DonationWidget;