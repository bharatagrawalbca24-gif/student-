import React, { useState, useEffect } from 'react';

const DoubtSessions = () => {
  const [sessions, setSessions] = useState([
    { id: 1, title: 'Data Structures - Graphs', mentor: 'Prof. Williams', date: 'April 16, 2:00 PM', type: '1-on-1' },
    { id: 2, title: 'React Performance Tuning', mentor: 'Sarah Jenkins', date: 'April 17, 4:00 PM', type: 'Group' }
  ]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Doubt Sessions</h1>
        <button className="btn-primary">Book New Session</button>
      </div>

      <div className="flex-col gap-4">
        {sessions.map((session, idx) => (
          <div key={session.id} className="glass-panel items-center justify-between flex animate-slide-up" style={{ padding: '1.5rem', animationDelay: `${idx * 0.1}s` }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{session.title}</h3>
              <p style={{ fontSize: '0.9rem' }}>Mentor: {session.mentor} • {session.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '99px', 
                background: session.type === '1-on-1' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                color: session.type === '1-on-1' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {session.type}
              </span>
              <button className="btn-secondary">Join Meeting</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoubtSessions;
