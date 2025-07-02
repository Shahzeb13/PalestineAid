import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DonationIntentHandler = () => {
  const [pendingIntents, setPendingIntents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.email) {
      checkPendingIntents();
    }
  }, [user]);

  const checkPendingIntents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/donation-intent/pending-intents?email=${user.email}`);
      const data = await response.json();
      
      if (data.success && data.intents.length > 0) {
        setPendingIntents(data.intents);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking pending intents:', error);
    }
  };

  const convertIntentToDonation = async (intentId) => {
    setConverting(true);
    try {
      const response = await fetch('http://localhost:5000/api/donation-intent/convert-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add proper auth
        },
        body: JSON.stringify({
          intentId,
          userId: user._id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove the converted intent from the list
        setPendingIntents(prev => prev.filter(intent => intent.id !== intentId));
        
        if (pendingIntents.length === 1) {
          setShowModal(false);
        }
        
        alert('Donation intent converted successfully!');
      } else {
        alert('Failed to convert donation intent: ' + data.message);
      }
    } catch (error) {
      console.error('Error converting intent:', error);
      alert('Failed to convert donation intent. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPendingIntents([]);
  };

  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: 18,
        padding: 32,
        maxWidth: 600,
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{textAlign: 'center', marginBottom: 24}}>
          <div style={{fontSize: 48, marginBottom: 16}}>🎁</div>
          <h2 style={{color: '#fff', fontWeight: 800, fontSize: 24, marginBottom: 8}}>Complete Your Donations</h2>
          <p style={{color: '#fff', fontSize: 16, opacity: 0.9}}>We found {pendingIntents.length} pending donation(s) for your email</p>
        </div>

        <div style={{marginBottom: 24}}>
          {pendingIntents.map((intent, index) => (
            <div key={intent.id} style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                <h3 style={{color: '#fff', fontWeight: 700, fontSize: 18}}>Donation #{index + 1}</h3>
                <span style={{color: '#fff', fontWeight: 600, fontSize: 20}}>${intent.amount}</span>
              </div>
              
              {intent.message && (
                <p style={{color: '#fff', fontSize: 14, marginBottom: 12, opacity: 0.9}}>
                  "{intent.message}"
                </p>
              )}
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{color: '#fff', fontSize: 12, opacity: 0.8}}>
                  Created: {new Date(intent.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => convertIntentToDonation(intent.id)}
                  disabled={converting}
                  style={{
                    background: '#fff',
                    color: '#059669',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontWeight: 600,
                    cursor: converting ? 'not-allowed' : 'pointer',
                    opacity: converting ? 0.7 : 1
                  }}
                >
                  {converting ? 'Converting...' : 'Complete Donation'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign: 'center'}}>
          <button
            onClick={closeModal}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationIntentHandler; 