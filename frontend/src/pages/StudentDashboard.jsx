import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentDashboard = () => {
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
      <h1 className="section-title text-gradient">Student Overview</h1>
      
      <div className="card p-loose mb-8 animate-slide-up delay-200">
        <h2 className="text-3xl font-bold mb-2">Welcome back{user && user.name ? `, ${user.name.split(' ')[0]}` : ''}!</h2>
        <p className="text-lg text-secondary">
           {data ? `You have ${data.upcomingSessions?.length || 0} upcoming doubt sessions this week. Keep up the good work!` : 'Loading your overview...'}
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="card animate-slide-up delay-300 flex-col relative" style={{ minHeight: '300px' }}>
          <h3 className="text-muted mb-4 font-semibold text-sm uppercase tracking-wider">Overall Attendance</h3>
          
          {data ? (
            <div className="flex-1 relative" style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Attended', value: data.overallAttendance },
                      { name: 'Missed', value: 100 - data.overallAttendance }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="var(--accent-primary)" />
                    <Cell fill="rgba(255,255,255,0.1)" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold" style={{ color: data.overallAttendance < 75 ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                  {data.overallAttendance}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">Loading...</div>
          )}

          {data?.overallAttendance < 75 && (
            <div className="mt-4 p-3 rounded-xl badge-warning w-full text-center">
              Warning: Low attendance
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

export default StudentDashboard;
