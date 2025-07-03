import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmergencyResponseWidget = () => {
  const [emergencyLevel, setEmergencyLevel] = useState('high');
  const [urgentNeeds, setUrgentNeeds] = useState([
    { id: 1, type: 'Medical Supplies', priority: 'Critical', icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="14" rx="3" fill="#fff"/><rect x="8" y="2" width="8" height="5" rx="2" fill="#009736"/><rect x="10.5" y="10" width="3" height="7" rx="1.5" fill="#ce1126"/><rect x="7" y="12.5" width="10" height="3" rx="1.5" fill="#ce1126"/></svg>
    ), description: 'Emergency medical kits and supplies needed immediately' },
    { id: 2, type: 'Food & Water', priority: 'High', icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="17" rx="7" ry="4" fill="#009736"/><rect x="7" y="7" width="10" height="7" rx="5" fill="#ce1126"/><ellipse cx="12" cy="7" rx="5" ry="2" fill="#fff"/></svg>
    ), description: 'Basic food supplies and clean water for families' },
    { id: 3, type: 'Shelter', priority: 'High', icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="10" width="16" height="9" rx="2" fill="#009736"/><polygon points="12,4 2,12 22,12" fill="#ce1126"/></svg>
    ), description: 'Temporary shelter and emergency housing support' },
    { id: 4, type: 'Children Aid', priority: 'Critical', icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="12" r="3" fill="#009736"/><circle cx="16" cy="12" r="3" fill="#ce1126"/><rect x="6" y="15" width="12" height="5" rx="2.5" fill="#fff"/></svg>
    ), description: 'Specialized support for children and families' }
  ]);

  const [stats, setStats] = useState({
    peopleInNeed: 2500000,
    familiesSupported: 15420,
    emergencyCalls: 892,
    responseTime: '2.3'
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        emergencyCalls: prev.emergencyCalls + Math.floor(Math.random() * 3),
        peopleInNeed: prev.peopleInNeed + Math.floor(Math.random() * 100)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getEmergencyColor = () => {
    switch (emergencyLevel) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      default: return '#059669';
    }
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, #ce1126 0%, #991b1b 100%)`,
      borderRadius: 32,
      padding: '3.5rem 3rem 2.5rem 3rem',
      maxWidth: 1600,
      width: '100%',
      margin: '0 auto 40px auto',
      boxShadow: '0 8px 32px rgba(206,17,38,0.18)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s',
    }}>
      {/* Emergency Alert Banner */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.1)',
        padding: '8px 0',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 600,
        color: '#fff',
        animation: 'pulse 2s infinite'
      }}>
        🚨 EMERGENCY RESPONSE ACTIVE - URGENT AID NEEDED 🚨
      </div>

      <div style={{ marginTop: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 18 }}>
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', background: '#fff' }}><rect x="3" y="7" width="18" height="14" rx="3" fill="#fff"/><rect x="8" y="2" width="8" height="5" rx="2" fill="#009736"/><rect x="10.5" y="10" width="3" height="7" rx="1.5" fill="#ce1126"/><rect x="7" y="12.5" width="10" height="3" rx="1.5" fill="#ce1126"/></svg>
          </div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 32, marginBottom: 8, textAlign: 'center' }}>Emergency Response Center</h2>
          <p style={{ color: '#fff', fontSize: 18, opacity: 0.92, textAlign: 'center' }}>Real-time crisis response and urgent humanitarian aid</p>
        </div>

        {/* Live Statistics */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2.5rem',
          marginBottom: '2.2rem',
          flexWrap: 'wrap',
          marginTop: '2.5rem',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.10)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.18)'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', textAlign: 'center' }}>
              {stats.peopleInNeed.toLocaleString()}
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9, textAlign: 'center' }}>People in Need</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.10)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.18)'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', textAlign: 'center' }}>
              {stats.familiesSupported.toLocaleString()}
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9, textAlign: 'center' }}>Families Supported</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.10)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.18)'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', textAlign: 'center' }}>
              {stats.emergencyCalls}
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9, textAlign: 'center' }}>Emergency Calls Today</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.10)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.18)'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', textAlign: 'center' }}>
              {stats.responseTime}h
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9, textAlign: 'center' }}>Avg Response Time</div>
          </div>
        </div>

        {/* Urgent Needs Grid */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 24, marginBottom: 20, textAlign: 'center' }}>
            Urgent Needs - Immediate Response Required
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}>
            {urgentNeeds.map((need) => (
              <div key={need.id} style={{
                background: 'rgba(255,255,255,0.10)',
                borderRadius: 12,
                padding: 20,
                border: '1px solid rgba(255,255,255,0.18)',
                transition: 'all 0.3s ease',
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 24, marginRight: 12 }}>{need.icon}</span>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{need.type}</div>
                    <div style={{
                      color: need.priority === 'Critical' ? '#fecaca' : '#fed7aa',
                      fontSize: 12,
                      fontWeight: 600,
                      textAlign: 'center'
                    }}>
                      {need.priority} Priority
                    </div>
                  </div>
                </div>
                <p style={{ color: '#fff', fontSize: 14, opacity: 0.9, marginBottom: 16, textAlign: 'center' }}>
                  {need.description}
                </p>
                <button style={{
                  background: '#fff',
                  color: '#ce1126',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14
                }}>
                  Respond Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Actions */}
        <div style={{
          display: 'flex',
          gap: '1.2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%',
          marginTop: 'auto',
        }}>
          <Link to="/emergency-donate" style={{
            background: '#009736',
            color: '#fff',
            borderRadius: 50,
            padding: '0.9rem 2rem',
            fontWeight: 800,
            fontSize: 16,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,151,54,0.10)',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.10)'
          }}>
            Emergency Donate
          </Link>
          
          <Link to="/volunteer" style={{
            background: '#009736',
            color: '#fff',
            borderRadius: 50,
            padding: '0.9rem 2rem',
            fontWeight: 800,
            fontSize: 16,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,151,54,0.10)',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.10)'
          }}>
            🤝 Volunteer Now
          </Link>
          
          <Link to="/emergency-contact" style={{
            background: '#009736',
            color: '#fff',
            borderRadius: 50,
            padding: '0.9rem 2rem',
            fontWeight: 800,
            fontSize: 16,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,151,54,0.10)',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.10)'
          }}>
            📞 Emergency Contact
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default EmergencyResponseWidget; 