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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in delay-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title text-gradient m-0">Doubt Sessions</h1>
        <button onClick={() => toast("Contacting mentor for custom slot...", { icon: '📅' })} className="btn btn-primary">Request Custom Slot</button>
      </div>

      <div className="flex-col gap-6">
        <AnimatePresence>
          {sessions.map((session, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={session.id} 
              className="card items-center justify-between flex animate-slide-up" 
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{session.title}</h3>
                  {session.status === 'Booked' && (
                    <span className="badge badge-success">BOOKED</span>
                  )}
                </div>
                <p className="text-sm flex items-center gap-2 text-secondary">
                  Mentor: <strong className="text-primary">{session.mentor}</strong> • <Calendar size={14} className="text-muted" /> {new Date(session.date).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`badge ${session.type === '1-on-1' ? 'badge-primary' : 'badge-warning'}`}>
                  {session.type}
                </span>
                
                {session.status !== 'Booked' ? (
                  <button onClick={() => handleBook(session.id)} className="btn btn-secondary">Book Session</button>
                ) : (
                  <button onClick={() => navigate(`/meet/session-${session.id}`)} className="btn btn-primary"><Video size={16}/> Join Meeting</button>
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
