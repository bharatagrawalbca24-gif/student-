import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoubtSessions = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/sessions`)
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => console.error("Failed to fetch sessions", err));
  }, []);

  const handleBook = (id) => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/sessions/${id}/book`, { method: 'POST' })
      .then(res => res.json())
      .then(updatedSession => {
        if (updatedSession.error) throw new Error();
        setSessions(prev => prev.map(s => s.id === id ? updatedSession : s));
        toast.success("Session Booked Successfully!");
      })
      .catch(() => toast.error("Failed to book session"));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in">
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Doubt Sessions</h1>
        <button onClick={() => toast("Contacting mentor for custom slot...", { icon: '📅' })} className="btn-primary">Request Custom Slot</button>
      </div>

      <div className="flex-col gap-4">
        <AnimatePresence>
          {sessions.map((session, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={session.id} 
              className="glass-panel items-center justify-between flex" 
              style={{ padding: '1.5rem' }}
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{session.title}</h3>
                  {session.status === 'Booked' && (
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16,185,129,0.2)', color: 'var(--accent-success)'}}>BOOKED</span>
                  )}
                </div>
                <p style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Mentor: <strong>{session.mentor}</strong> • <Calendar size={14}/> {new Date(session.date).toLocaleString()}
                </p>
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
                
                {session.status !== 'Booked' ? (
                  <button onClick={() => handleBook(session.id)} className="btn-secondary">Book Session</button>
                ) : (
                  <button onClick={() => navigate(`/meet/session-${session.id}`)} className="btn-primary flex items-center gap-2"><Video size={16}/> Join Meeting</button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DoubtSessions;
