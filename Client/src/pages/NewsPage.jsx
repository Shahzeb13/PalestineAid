import React from 'react';

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
  },
  {
    title: "Global Solidarity for Gaza",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    summary: "People around the world unite in support of Gaza, organizing rallies, fundraisers, and awareness campaigns.",
    link: "#"
  }
];

const NewsPage = () => {
  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', padding: 0}}>
      {/* Hero Image */}
      <div style={{position: 'relative', height: 340, width: '100%', overflow: 'hidden'}}>
        <img src="/Client/Images/background.png" alt="Gaza Crisis" style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)'}} />
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(244,63,94,0.4) 100%)'}}></div>
        <div style={{position: 'absolute', bottom: 32, left: 32, color: '#fff', zIndex: 2}}>
          <h1 style={{fontSize: 40, fontWeight: 800, margin: 0, textShadow: '0 4px 24px #000'}}>Gaza News & Current Affairs</h1>
          <p style={{fontSize: 20, fontWeight: 500, marginTop: 8, textShadow: '0 2px 8px #000'}}>Stay informed. Stay inspired. Make a difference.</p>
        </div>
      </div>
      {/* News Cards */}
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', margin: '48px auto', maxWidth: 1200}}>
        {news.map((item, idx) => (
          <div key={idx} style={{background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(99,102,241,0.10)', width: 320, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer', position: 'relative'}}>
            <div style={{height: 180, width: '100%', overflow: 'hidden', position: 'relative'}}>
              <img src={item.image} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s'}} />
              <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(244,63,94,0.08) 100%)'}}></div>
            </div>
            <div style={{padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
              <h2 style={{fontSize: 22, fontWeight: 700, margin: 0, color: '#232526', marginBottom: 12}}>{item.title}</h2>
              <p style={{fontSize: 15, color: '#374151', marginBottom: 16, flex: 1}}>{item.summary}</p>
              <a href={item.link} style={{color: '#6366f1', fontWeight: 700, textDecoration: 'none', fontSize: 15, alignSelf: 'flex-start'}}>Read More →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage; 