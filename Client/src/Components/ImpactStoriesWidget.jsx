import React, { useState } from 'react';

const ImpactStoriesWidget = () => {
  const [activeStory, setActiveStory] = useState(0);

  const impactStories = [
    {
      id: 1,
      name: "Ahmad's Family",
      location: "Gaza City",
      story: "After losing our home in the conflict, we were struggling to provide basic necessities for our three children. PalestineAid provided us with emergency shelter, food supplies, and medical care. Today, our children are back in school and we have hope for a better future.",
      impact: "Family of 5 supported for 6 months",
      before: "Homeless, no access to food or medical care",
      after: "Stable shelter, children back in school, regular meals",
      image: "👨‍👩‍👧‍👦",
      category: "Family Support"
    },
    {
      id: 2,
      name: "Fatima's Medical Recovery",
      location: "West Bank",
      story: "I was injured during the crisis and couldn't afford medical treatment. Thanks to the emergency medical fund, I received surgery and rehabilitation. I can now walk again and support my elderly parents.",
      impact: "Complete medical recovery achieved",
      before: "Severe injury, unable to walk or work",
      after: "Fully recovered, supporting family again",
      image: "🏥",
      category: "Medical Aid"
    },
    {
      id: 3,
      name: "Omar's Education",
      location: "Jerusalem",
      story: "I lost my father in the conflict and thought I would have to drop out of school to support my family. The education support program helped me continue my studies while providing basic needs for my mother and siblings.",
      impact: "Student maintained education, family supported",
      before: "Forced to drop out, family struggling",
      after: "Continuing education, family stable",
      image: "📚",
      category: "Education Support"
    },
    {
      id: 4,
      name: "Layla's Community Kitchen",
      location: "Hebron",
      story: "Our community kitchen serves 200 meals daily to families in need. With support from PalestineAid, we've expanded our operations and now provide hot meals, food packages, and cooking classes for sustainable food security.",
      impact: "200+ meals served daily",
      before: "Limited resources, 50 meals per day",
      after: "Expanded kitchen, sustainable food program",
      image: "🍲",
      category: "Community Development"
    }
  ];

  const stats = [
    { number: "15,420+", label: "Families Helped", icon: "👨‍👩‍👧‍👦" },
    { number: "2.5M+", label: "Meals Provided", icon: "🍽️" },
    { number: "8,900+", label: "Medical Cases", icon: "🏥" },
    { number: "3,200+", label: "Students Supported", icon: "📚" }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      borderRadius: 20,
      padding: 32,
      margin: '40px auto',
      maxWidth: 1200,
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💙</div>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Stories of Impact</h2>
        <p style={{ color: '#fff', fontSize: 18, opacity: 0.9 }}>Real stories of hope, resilience, and transformation</p>
      </div>

      {/* Impact Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 40
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              {stat.number}
            </div>
            <div style={{ color: '#fff', fontSize: 14, opacity: 0.9 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Story Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
        flexWrap: 'wrap'
      }}>
        {impactStories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(index)}
            style={{
              background: activeStory === index ? '#fff' : 'rgba(255,255,255,0.1)',
              color: activeStory === index ? '#1e40af' : '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.3s ease'
            }}
          >
            {story.category}
          </button>
        ))}
      </div>

      {/* Active Story Display */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 32,
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginRight: 16 }}>{impactStories[activeStory].image}</div>
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
              {impactStories[activeStory].name}
            </h3>
            <p style={{ color: '#fff', opacity: 0.8, fontSize: 16 }}>
              {impactStories[activeStory].location}
            </p>
          </div>
        </div>

        <p style={{ color: '#fff', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
          "{impactStories[activeStory].story}"
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 20,
          marginBottom: 24
        }}>
          <div style={{
            background: 'rgba(220, 38, 38, 0.2)',
            borderRadius: 8,
            padding: 16,
            border: '1px solid rgba(220, 38, 38, 0.3)'
          }}>
            <h4 style={{ color: '#fecaca', fontWeight: 600, marginBottom: 8 }}>Before</h4>
            <p style={{ color: '#fff', fontSize: 14 }}>{impactStories[activeStory].before}</p>
          </div>
          
          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            borderRadius: 8,
            padding: 16,
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <h4 style={{ color: '#bbf7d0', fontWeight: 600, marginBottom: 8 }}>After</h4>
            <p style={{ color: '#fff', fontSize: 14 }}>{impactStories[activeStory].after}</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: 16,
          textAlign: 'center'
        }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
            Impact: {impactStories[activeStory].impact}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <p style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
          Your support makes these stories possible. Join us in creating more stories of hope.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            background: '#fff',
            color: '#1e40af',
            border: 'none',
            borderRadius: 12,
            padding: '16px 32px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,255,255,0.2)'
          }}>
            💝 Make a Difference
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 12,
            padding: '16px 32px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer'
          }}>
            📖 Read More Stories
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpactStoriesWidget; 