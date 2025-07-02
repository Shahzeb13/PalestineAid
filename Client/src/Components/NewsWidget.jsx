import React from 'react';
import { Link } from 'react-router-dom';

const news = [
  {
    title: "Gaza: Humanitarian Crisis Deepens",
    image: "/Client/Images/background.png",
    summary: "Ongoing conflict has left thousands in urgent need of food, water, and medical aid. International organizations call for immediate action.",
    link: "#"
  },
  {
    title: "Children in Gaza: The Lost Generation",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    summary: "With schools destroyed and families displaced, Gaza's children face an uncertain future. Relief efforts are underway, but more support is needed.",
    link: "#"
  },
  {
    title: "Aid Convoys Face Blockades",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    summary: "Humanitarian convoys struggle to reach those in need as border restrictions tighten. Calls for safe passage grow louder.",
    link: "#"
  }
];

const NewsWidget = () => {
  return (
    <div style={{background: 'linear-gradient(135deg, #232526 0%, #6366f1 100%)', borderRadius: 18, boxShadow: '0 4px 24px rgba(99,102,241,0.10)', padding: 24, maxWidth: 900, margin: '0 auto', marginTop: 32}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
        <h2 style={{color: '#fff', fontWeight: 800, fontSize: 28, margin: 0, letterSpacing: 1}}>Latest Gaza News</h2>
        <Link to="/news" style={{color: '#fff', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', borderRadius: 8, padding: '8px 20px', fontWeight: 700, textDecoration: 'none', fontSize: 16, boxShadow: '0 2px 8px rgba(99,102,241,0.10)'}}>See All News</Link>
      </div>
      <div style={{display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center'}}>
        {news.slice(0, 3).map((item, idx) => (
          <div key={idx} style={{background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(99,102,241,0.08)', width: 260, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer', position: 'relative'}}>
            <div style={{height: 110, width: '100%', overflow: 'hidden', position: 'relative'}}>
              <img src={item.image} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s'}} />
              <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(244,63,94,0.10) 100%)'}}></div>
            </div>
            <div style={{padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
              <h3 style={{fontSize: 17, fontWeight: 700, margin: 0, color: '#232526', marginBottom: 8, minHeight: 44}}>{item.title}</h3>
              <p style={{fontSize: 13, color: '#374151', marginBottom: 10, flex: 1, minHeight: 36}}>{item.summary}</p>
              <a href={item.link} style={{color: '#6366f1', fontWeight: 700, textDecoration: 'none', fontSize: 14, alignSelf: 'flex-start'}}>Read More →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsWidget; 