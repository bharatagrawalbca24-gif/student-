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
    <div className="animate-fade-in delay-100">
      <h1 className="section-title text-gradient">Topic-wise Assignments</h1>
      
      <div className="flex-col gap-6 mt-8">
        {assignments.map((assignment, idx) => (
          <div key={assignment.id} className="card flex justify-between items-center animate-slide-up" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{assignment.title}</h3>
                <span className={`badge ${assignment.status === 'Submitted' ? 'badge-success' : 'badge-warning'}`}>
                  {assignment.status}
                </span>
              </div>
              <p className="text-sm text-secondary">Subject: <strong className="text-primary">{assignment.subject}</strong> | Topic: {assignment.topic}</p>
              <p className="text-sm mt-3 flex items-center gap-1 font-semibold" style={{ color: 'var(--accent-secondary)' }}>
                <Clock size={16} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              {assignment.status !== 'Submitted' ? (
                <button className="btn btn-primary" onClick={() => handleSubmit(assignment.id)}>
                   Submit Work
                </button>
              ) : (
                <button className="btn btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                  <CheckCircle size={18} className="text-green-400" /> Submitted
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
