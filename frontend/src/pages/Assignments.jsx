import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/assignments`)
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(err => console.error("Failed to fetch assignments", err));
  }, []);

  const handleSubmit = (id) => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/assignments/${id}/submit`, { method: 'POST' })
      .then(res => res.json())
      .then(updated => {
        setAssignments(prev => prev.map(a => a.id === id ? updated : a));
        toast.success("Assignment submitted successfully!");
      })
      .catch(() => toast.error("Failed to submit assignment"));
  };

  return (
    <div className="animate-fade-in">
      <h1 className="section-title">Topic-wise Assignments</h1>
      
      <div className="flex-col gap-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="glass-panel flex justify-between items-center" style={{ padding: '1.5rem' }}>
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>{assignment.title}</h3>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '12px',
                  background: assignment.status === 'Submitted' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: assignment.status === 'Submitted' ? 'var(--accent-success)' : 'var(--accent-warning)',
                  border: `1px solid ${assignment.status === 'Submitted' ? 'var(--accent-success)' : 'var(--accent-warning)'}`
                }}>
                  {assignment.status}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem' }}>Subject: <strong>{assignment.subject}</strong> | Topic: {assignment.topic}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              {assignment.status !== 'Submitted' ? (
                <button className="btn-primary flex items-center gap-2" onClick={() => handleSubmit(assignment.id)}>
                   Submit Work
                </button>
              ) : (
                <button className="btn-secondary flex items-center gap-2" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                  <CheckCircle size={18} /> Submitted
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
