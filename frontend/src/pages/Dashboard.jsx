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
    <div className="animate-fade-in delay-100">
      <h1 className="section-title text-gradient">Overview Dashboard</h1>
      
      <div className="card p-loose mb-8 animate-slide-up delay-200">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Alex!</h2>
        <p className="text-lg text-secondary">You have 2 upcoming doubt sessions this week. Keep up the good work!</p>
      </div>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="card animate-slide-up delay-300">
          <h3 className="text-muted mb-4 font-semibold text-sm uppercase tracking-wider">Overall Attendance</h3>
          <div className="text-5xl font-bold" style={{ color: data?.overallAttendance < 75 ? 'var(--accent-danger)' : 'var(--accent-primary)' }}>
            {data ? data.overallAttendance : '--'}%
          </div>
          {data?.overallAttendance < 75 && (
            <div className="mt-6 p-4 rounded-xl badge-warning">
              Warning: Your attendance is critically low.
            </div>
          )}
        </div>
        
        <div className="card animate-slide-up delay-400" style={{ gridColumn: 'span 2' }}>
          <h3 className="text-muted mb-4 font-semibold text-sm uppercase tracking-wider">Upcoming Events</h3>
          <div className="flex-col gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <strong className="text-primary">React Hooks Deep Dive</strong> <span className="text-muted">— Tomorrow at 10:00 AM</span>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <strong className="text-primary">System Design Peer Review</strong> <span className="text-muted">— April 19th</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
