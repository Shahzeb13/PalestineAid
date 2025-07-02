import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmergencyResponseWidget = () => {
  const [emergencyLevel, setEmergencyLevel] = useState('high');
  const [urgentNeeds, setUrgentNeeds] = useState([
    { id: 1, type: 'Medical Supplies', priority: 'Critical', icon: '🏥', description: 'Emergency medical kits and supplies needed immediately' },
    { id: 2, type: 'Food & Water', priority: 'High', icon: '🍞', description: 'Basic food supplies and clean water for families' },
    { id: 3, type: 'Shelter', priority: 'High', icon: '🏠', description: 'Temporary shelter and emergency housing support' },
    { id: 4, type: 'Children Aid', priority: 'Critical', icon: '👶', description: 'Specialized support for children and families' }
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
      background: `linear-gradient(135deg, ${getEmergencyColor()} 0%, #991b1b 100%)`,
      borderRadius: 20,
      padding: 32,
      margin: '40px auto',
      maxWidth: 1200,
      boxShadow: `0 8px 32px rgba(220, 38, 38, 0.3)`,
      position: 'relative',
      overflow: 'hidden'
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚨</div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Emergency Response Center</h2>
          <p style={{ color: '#fff', fontSize: 18, opacity: 0.9 }}>Real-time crisis response and urgent humanitarian aid</p>
        </div>

        {/* Live Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          marginBottom: 32
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>
              {stats.peopleInNeed.toLocaleString()}
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9 }}>People in Need</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>
              {stats.familiesSupported.toLocaleString()}
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9 }}>Families Supported</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>
              {stats.emergencyCalls}
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9 }}>Emergency Calls Today</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>
              {stats.responseTime}h
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9 }}>Avg Response Time</div>
          </div>
        </div>

        {/* Urgent Needs Grid */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 24, marginBottom: 20, textAlign: 'center' }}>
            Urgent Needs - Immediate Response Required
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16
          }}>
            {urgentNeeds.map((need) => (
              <div key={need.id} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 20,
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 24, marginRight: 12 }}>{need.icon}</span>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>{need.type}</div>
                    <div style={{
                      color: need.priority === 'Critical' ? '#fecaca' : '#fed7aa',
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {need.priority} Priority
                    </div>
                  </div>
                </div>
                <p style={{ color: '#fff', fontSize: 14, opacity: 0.9, marginBottom: 16 }}>
                  {need.description}
                </p>
                <button style={{
                  background: '#fff',
                  color: getEmergencyColor(),
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
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/emergency-donate" style={{
            background: '#fff',
            color: getEmergencyColor(),
            borderRadius: 12,
            padding: '16px 32px',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 18,
            boxShadow: '0 4px 16px rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            🚨 Emergency Donate
          </Link>
          
          <Link to="/volunteer" style={{
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: 12,
            padding: '16px 32px',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 18,
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            🤝 Volunteer Now
          </Link>
          
          <Link to="/emergency-contact" style={{
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: 12,
            padding: '16px 32px',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 18,
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
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