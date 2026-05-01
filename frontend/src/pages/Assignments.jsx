import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
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

  const pending = assignments.filter(a => a.status !== 'Submitted');
  const submitted = assignments.filter(a => a.status === 'Submitted');

  const AssignmentCard = ({ assignment }) => (
    <div className="card p-tight flex-col gap-3 mb-4 cursor-pointer hover:border-primary/50 transition-colors shadow-lg bg-black/40">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-lg leading-tight pr-4">{assignment.title}</h4>
        {assignment.status === 'Submitted' ? (
          <CheckCircle size={20} className="text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle size={20} className="text-orange-400 shrink-0" />
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        <span className="text-[10px] uppercase font-bold bg-white/5 px-2 py-1 rounded text-secondary border border-white/5">{assignment.subject}</span>
        <span className="text-[10px] uppercase font-bold bg-primary/10 px-2 py-1 rounded text-primary border border-primary/20">{assignment.topic}</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <p className="text-xs flex items-center gap-1 text-muted font-medium">
          <Clock size={14} className={assignment.status !== 'Submitted' ? 'text-orange-300' : ''} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
        </p>
        {assignment.status !== 'Submitted' && (
          <button className="text-xs font-bold bg-primary hover:bg-white hover:text-black px-3 py-1.5 rounded-lg transition-colors text-white shadow-md" onClick={() => handleSubmit(assignment.id)}>Submit Now</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in delay-100 flex-col h-full">
      <h1 className="section-title text-gradient">Assignment Board</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 flex-1">
        <div className="flex-col glass-panel p-loose animate-slide-up delay-200 shadow-inner" style={{ background: 'rgba(245, 158, 11, 0.02)', borderTop: '3px solid rgba(245, 158, 11, 0.3)' }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4 text-orange-100">
            <AlertCircle className="text-orange-400"/> Pending Tasks 
            <span className="badge badge-warning ml-auto shadow-md">{pending.length}</span>
          </h2>
          <div className="flex-col overflow-y-auto pr-2" style={{ maxHeight: '60vh' }}>
            {pending.length > 0 ? pending.map(a => <AssignmentCard key={a.id} assignment={a} />) : <div className="text-center p-8 text-muted border border-dashed border-white/10 rounded-2xl">No pending tasks. You're all caught up!</div>}
          </div>
        </div>
        
        <div className="flex-col glass-panel p-loose animate-slide-up delay-300 shadow-inner" style={{ background: 'rgba(16, 185, 129, 0.02)', borderTop: '3px solid rgba(16, 185, 129, 0.3)' }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-4 text-emerald-100">
            <CheckCircle className="text-emerald-400"/> Completed 
            <span className="badge badge-success ml-auto shadow-md">{submitted.length}</span>
          </h2>
          <div className="flex-col overflow-y-auto pr-2" style={{ maxHeight: '60vh' }}>
            {submitted.length > 0 ? submitted.map(a => <AssignmentCard key={a.id} assignment={a} />) : <div className="text-center p-8 text-muted border border-dashed border-white/10 rounded-2xl">No completed tasks yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
