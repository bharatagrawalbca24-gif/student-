import React from 'react';

const Brainstorming = () => {
  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Brainstorming Space</h1>
        <button className="btn-primary">+ New Topic</button>
      </div>

      <div className="flex gap-6" style={{ flex: 1 }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Active Discussions</h3>
          <div className="flex-col gap-2">
            {['Hackathon Idea Pitching', 'Machine Learning Project Datasets', 'UI/UX Feedback for Portfolios'].map((topic, i) => (
              <div key={i} style={{ 
                padding: '1rem', 
                background: i === 0 ? 'rgba(135, 153, 130, 0.1)' : 'var(--glass-bg)', 
                borderLeft: i === 0 ? '3px solid var(--accent-primary)' : '3px solid transparent',
                borderRadius: '8px', 
                cursor: 'pointer' 
              }}>
                <h4 style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{topic}</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{3 - i} active peers</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel flex-col" style={{ flex: 2, padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Hackathon Idea Pitching</h3>
          <div style={{ flex: 1, background: 'var(--bg-primary)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', overflowY: 'auto', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', marginBottom: '0.5rem', width: 'fit-content' }}>
              <strong style={{ color: 'var(--accent-secondary)', display: 'block', fontSize: '0.8rem' }}>Alex Doe</strong>
              How about an AI-based agriculture crop predictor?
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '8px', marginBottom: '0.5rem', width: 'fit-content', marginLeft: 'auto' }}>
              <strong style={{ color: 'rgba(255,255,255,0.8)', display: 'block', fontSize: '0.8rem', textAlign: 'right' }}>You</strong>
              That sounds great, we can use the Kaggle dataset!
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#ffffff', color: 'var(--text-primary)', outline: 'none' }}
            />
            <button className="btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brainstorming;
