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
    <div className="animate-fade-in delay-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title text-gradient m-0">Attendance Tracker</h1>
        <button onClick={() => toast.success("Downloading attendance report...")} className="btn btn-secondary">Download Report</button>
      </div>

      <div className="flex-col gap-6">
        {attendanceData.map((item, idx) => {
          const percentage = calculatePercentage(item.attendedClasses, item.totalClasses);
          const isDanger = percentage < 75;

          return (
            <div key={idx} className="card animate-slide-up" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.subject}</h3>
                  <p className="text-sm text-secondary">{item.attendedClasses} / {item.totalClasses} Classes Attended</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: isDanger ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                    {percentage}%
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)' }}>
                <div style={{ 
                  width: `${percentage}%`, 
                  height: '100%', 
                  background: isDanger ? 'var(--accent-danger)' : 'var(--accent-success)',
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: `0 0 10px ${isDanger ? 'rgba(225, 29, 72, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`
                }} />
              </div>

              {isDanger && (
                <div className="flex items-center gap-2 mt-4 text-sm font-semibold" style={{ color: 'var(--accent-danger)' }}>
                  <AlertCircle size={18} />
                  <span>Warning: Attendance is below 75% minimum requirement.</span>
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
