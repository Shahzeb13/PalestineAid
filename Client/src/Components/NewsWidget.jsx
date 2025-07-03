import React from 'react';
import { Link } from 'react-router-dom';

const news = [
  {
    title: "Gaza: Humanitarian Crisis Deepens",
    image: "https://images.theconversation.com/files/586146/original/file-20240404-17-qhh5n.jpg?ixlib=rb-4.1.0&rect=0%2C91%2C3402%2C2164&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip",
    summary: "Ongoing conflict has left thousands in urgent need of food, water, and medical aid. International organizations call for immediate action.",
    link: "#"
  },
  {
    title: "Children in Gaza: The Lost Generation",
    image: "https://cloudfront-us-east-1.images.arcpublishing.com/opb/Z7TL7SGR65CUFP767XY74LBNCU.jpg",
    summary: "With schools destroyed and families displaced, Gaza's children face an uncertain future. Relief efforts are underway, but more support is needed.",
    link: "#"
  },
  {
    title: "Aid Convoys Face Blockades",
    image: "https://media.gettyimages.com/id/2157690599/photo/gaza-city-gaza-aid-trucks-of-the-united-nations-relief-and-works-agency-for-palestinian.jpg?s=612x612&w=gi&k=20&c=a56TkFk5KlDVVV-m-nwQ3ysX2D_CE3gDJJYIR1PdIKU=",
    summary: "Humanitarian convoys struggle to reach those in need as border restrictions tighten. Calls for safe passage grow louder.",
    link: "#"
  },
  {
    title: "International Support Grows",
    image: "https://www.worldvision.org.uk/media/equd1evg/flags-outside-the-un-building-in-genevea.jpg",
    summary: "Global organizations and communities are increasing their support for Gaza, providing essential aid and raising awareness.",
    link: "#"
  },
];

const NewsWidget = () => {
  return (
    <div style={{
      background: 'linear-gradient(120deg, #18181b 60%, #232526 100%)',
      borderRadius: 32,
      padding: '3.5rem 1.5rem 2.5rem 1.5rem',
      maxWidth: 1600,
      width: '100%',
      margin: '0 auto 40px auto',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s',
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: '-24px'}}>
        <h2 style={{color: '#ce1126', fontWeight: 900, fontSize: 28, margin: 0, letterSpacing: 1, textAlign: 'center'}}>Latest Gaza News</h2>
      </div>
      <div style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1400,
      }}>
        {news.map((item, idx) => (
          <div key={idx} style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            flex: '1 1 320px',
            minWidth: 320,
            maxWidth: 370,
            margin: '12px 0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            position: 'relative',
            border: '1.5px solid #e5e7eb',
            outline: 'none',
          }}
          tabIndex={0}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.13)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)'; }}
          >
            <div style={{height: 220, width: '100%', overflow: 'hidden', position: 'relative', background: '#f3f4f6'}}>
              <img src={item.image} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderTopLeftRadius: 18, borderTopRightRadius: 18}} />
              <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(244,63,94,0.10) 100%)'}}></div>
            </div>
            <div style={{padding: '1.1rem 1rem 1.2rem 1rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
              <h3 style={{fontSize: 17, fontWeight: 700, margin: 0, color: '#232526', marginBottom: 8, minHeight: 32, lineHeight: 1.2}}>{item.title}</h3>
              <p style={{fontSize: 13, color: '#374151', marginBottom: 0, flex: 1, minHeight: 32, lineHeight: 1.4}}>{item.summary}</p>
              <a href={item.link} style={{color: '#6366f1', fontWeight: 600, fontSize: 13, marginTop: 12, textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">Read More &rarr;</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsWidget; 