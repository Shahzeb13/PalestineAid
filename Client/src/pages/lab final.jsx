import React from 'react';

const news = [
  {
    title: "Gaza: Humanitarian Crisis Deepens",
    image: "/Client/Images/background.png",
    summary: "Ongoing conflict has left thousands in urgent need of food, water, and medical aid. International organizations call for immediate action.",
    link: "https://www.aljazeera.com/news/2024/6/30/gaza-humanitarian-crisis-deepens"
  },
  {
    title: "Children in Gaza: The Lost Generation",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    summary: "With schools destroyed and families displaced, Gaza's children face an uncertain future. Relief efforts are underway, but more support is needed.",
    link: "https://www.unicef.org/press-releases/gaza-children-lost-generation"
  },
  {
    title: "Aid Convoys Face Blockades",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    summary: "Humanitarian convoys struggle to reach those in need as border restrictions tighten. Calls for safe passage grow louder.",
    link: "https://www.bbc.com/news/world-middle-east-68712345"
  },
  {
    title: "Global Solidarity for Gaza",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    summary: "People around the world unite in support of Gaza, organizing rallies, fundraisers, and awareness campaigns.",
    link: "https://www.theguardian.com/world/2024/jun/30/global-solidarity-gaza"
  },
  {
    title: "Medical Teams Work Around the Clock",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80",
    summary: "Doctors and nurses in Gaza are providing life-saving care under extremely difficult conditions, often risking their own safety to help others.",
    link: "https://www.doctorswithoutborders.org/latest/gaza-medical-teams"
  },
  {
    title: "Education Initiatives Bring Hope",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
    summary: "Despite the challenges, new education programs are being launched to help children and youth continue learning and dreaming of a better future.",
    link: "https://www.hrw.org/news/2024/06/29/gaza-education-hope"
  },
  {
    title: "Clean Water Efforts Intensify",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=600&q=80",
    summary: "NGOs and local groups are working to provide clean water to families in Gaza as infrastructure damage worsens.",
    link: "https://www.reuters.com/world/middle-east/gaza-water-crisis-2024-06-30/"
  },
  {
    title: "Artists Share Stories of Resilience",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    summary: "Gazan artists are using their talents to document daily life and inspire hope through murals, music, and poetry.",
    link: "https://www.nytimes.com/2024/06/30/world/middleeast/gaza-artists-resilience.html"
  }
];

const NewsPage = () => {
  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', padding: 0}}>
      {/* Hero Image */}
      <div style={{position: 'relative', height: 340, width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <img src="/Client/Images/background.png" alt="Gaza Crisis" style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)', position: 'absolute', left: 0, top: 0, zIndex: 0}} />
        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(244,63,94,0.4) 100%)', zIndex: 1}}></div>
        <div style={{position: 'relative', color: '#fff', zIndex: 2, maxWidth: 700, textAlign: 'center'}}>
          <h1 style={{fontSize: 44, fontWeight: 900, margin: 0, textShadow: '0 4px 24px #000', letterSpacing: 1}}>Gaza News & Current Affairs</h1>
          <p style={{fontSize: 22, fontWeight: 500, marginTop: 12, textShadow: '0 2px 8px #000', lineHeight: 1.5}}>
            Stay informed. Stay inspired. Make a difference.<br/>
            <span style={{fontWeight:600, color:'#fff'}}>Get the latest updates, stories, and urgent calls for support from Gaza. Your awareness and action can help save lives and bring hope to those in need.</span>
          </p>
        </div>
      </div>
      {/* News Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32,
        justifyContent: 'center',
        margin: '56px auto 48px auto',
        maxWidth: 1280
      }}>
        {news.map((item, idx) => (
          <div key={idx} style={{background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(99,102,241,0.10)', width: '100%', minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer', position: 'relative', border: '1.5px solid #e5e7eb'}}>
            <div style={{height: 200, width: '100%', overflow: 'hidden', position: 'relative', background: '#f3f4f6'}}>
              <img src={item.image} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', display: 'block', borderTopLeftRadius: 18, borderTopRightRadius: 18}} />
              <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(244,63,94,0.08) 100%)'}}></div>
            </div>
            <div style={{padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
              <h2 style={{fontSize: 22, fontWeight: 700, margin: 0, color: '#232526', marginBottom: 12, minHeight: 48, lineHeight: 1.2}}>{item.title}</h2>
              <p style={{fontSize: 15, color: '#374151', marginBottom: 16, flex: 1, minHeight: 48, lineHeight: 1.4}}>{item.summary}</p>
              <a href={item.link} style={{color: '#6366f1', fontWeight: 700, textDecoration: 'none', fontSize: 15, alignSelf: 'flex-start', marginTop: 8}} target="_blank" rel="noopener noreferrer">Read More →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage; 