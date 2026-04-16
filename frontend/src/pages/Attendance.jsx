import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/attendance`)
      .then(res => res.json())
      .then(data => setAttendanceData(data))
      .catch(() => {
        // Fallback for UI if backend is not running
        setAttendanceData([
          { subject: 'Computer Networks', totalClasses: 40, attendedClasses: 28 },
          { subject: 'Operating Systems', totalClasses: 35, attendedClasses: 30 },
          { subject: 'Database Systems', totalClasses: 38, attendedClasses: 29 },
          { subject: 'Software Engineering', totalClasses: 32, attendedClasses: 30 }
        ]);
      });
  }, []);

  const calculatePercentage = (attended, total) => Math.round((attended / total) * 100);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Attendance Tracker</h1>
        <button onClick={() => toast.success("Downloading attendance report...")} className="btn-secondary">Download Report</button>
      </div>

      <div className="flex-col gap-6">
        {attendanceData.map((item, idx) => {
          const percentage = calculatePercentage(item.attendedClasses, item.totalClasses);
          const isDanger = percentage < 75;

          return (
            <div key={idx} className="glass-panel animate-slide-up" style={{ padding: '1.5rem', animationDelay: `${idx * 0.1}s` }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.subject}</h3>
                  <p style={{ fontSize: '0.9rem' }}>{item.attendedClasses} / {item.totalClasses} Classes Attended</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: isDanger ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                    {percentage}%
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${percentage}%`, 
                  height: '100%', 
                  background: isDanger ? 'var(--accent-danger)' : 'var(--accent-success)',
                  transition: 'width 1s ease-out'
                }} />
              </div>

              {isDanger && (
                <div className="flex items-center gap-2" style={{ marginTop: '1rem', color: 'var(--accent-danger)' }}>
                  <AlertCircle size={18} />
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Warning: Attendance is below 75% minimum requirement.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;
