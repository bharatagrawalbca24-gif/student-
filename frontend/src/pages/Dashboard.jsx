import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // In a real app we'd fetch from backend, here we mock it to show immediate UI
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/dashboard`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Failed to fetch backend data", err));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="section-title">Overview Dashboard</h1>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, Alex!</h2>
        <p>You have 2 upcoming doubt sessions this week. Keep up the good work!</p>
      </div>
      
      <div className="flex gap-6">
        <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Overall Attendance</h3>
          <div style={{ fontSize: '3rem', fontWeight: '700', color: data?.overallAttendance < 75 ? 'var(--accent-danger)' : 'var(--accent-primary)' }}>
            {data ? data.overallAttendance : '--'}%
          </div>
          {data?.overallAttendance < 75 && (
            <div style={{ marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--accent-danger)' }}>
              Warning: Your attendance is critically low.
            </div>
          )}
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', flex: 2 }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Upcoming Events</h3>
          <div className="flex-col gap-4">
            <div style={{ background: 'var(--glass-border)', padding: '1rem', borderRadius: '8px' }}>
              <strong>React Hooks Deep Dive</strong> - Tomorrow at 10:00 AM
            </div>
            <div style={{ background: 'var(--glass-border)', padding: '1rem', borderRadius: '8px' }}>
              <strong>System Design Peer Review</strong> - April 19th
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
