import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const { user } = useContext(AuthContext);

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
        <h2 className="text-3xl font-bold mb-2">Welcome back{user && user.name ? `, ${user.name.split(' ')[0]}` : ''}!</h2>
        <p className="text-lg text-secondary">
           {data ? `You have ${data.upcomingSessions?.length || 0} upcoming doubt sessions this week. Keep up the good work!` : 'Loading your overview...'}
        </p>
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
            {data && data.upcomingSessions && data.upcomingSessions.length > 0 ? (
                data.upcomingSessions.map((session, idx) => (
                    <div key={session._id || idx} className="p-4 rounded-xl mb-4" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <strong className="text-primary">{session.title}</strong> <span className="text-muted">— {new Date(session.date).toLocaleDateString()}</span>
                    </div>
                ))
            ) : (
                <div className="text-muted">No upcoming events scheduled.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
