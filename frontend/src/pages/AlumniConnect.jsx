import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, MessageCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AlumniConnect = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/alumni`)
      .then(res => res.json())
      .then(data => setAlumniData(data))
      .catch(() => {
        setAlumniData([
          { id: 1, name: 'Sarah Jenkins', role: 'Software Engineer @ Google', expertise: ['Frontend', 'React'] },
          { id: 2, name: 'David Chen', role: 'Backend Engineer @ Stripe', expertise: ['Node.js', 'System Design'] },
          { id: 3, name: 'Emily Carter', role: 'Product Manager @ Atlassian', expertise: ['Product', 'Agile'] }
        ]);
      });
  }, []);

  const handleMessage = (id) => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/alumni/${id}/message`, { method: 'POST' })
      .then(res => res.json())
      .then(data => toast.success("Message sent! They will get back to you."))
      .catch(() => toast.error("Failed to send message"));
  };

  const handleMeet = (id) => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/alumni/${id}/meet`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        toast.success("Meeting invite sent! Opening room...");
        setTimeout(() => navigate(`/meet/alumni-${id}`), 1000);
      })
      .catch(() => toast.error("Failed to send invite"));
  };

  const filteredAlumni = alumniData.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in">
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Alumni Connect</h1>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search alumni by name, role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
              borderRadius: '8px', 
              border: '1px solid var(--glass-border)', 
              background: 'var(--glass-bg)', 
              color: 'var(--text-primary)', 
              outline: 'none',
              width: '300px',
              transition: 'all 0.3s'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {filteredAlumni.map((alumni) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={alumni.id} 
              className="glass-panel" 
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div className="flex items-center gap-4">
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', color: '#fff' }}>
                  {alumni.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{alumni.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><Briefcase size={12} style={{ display: 'inline', marginRight: '4px' }}/>{alumni.role}</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {alumni.expertise.map((skill, i) => (
                  <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between mt-auto" style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <button onClick={() => handleMessage(alumni.id)} className="btn-secondary flex items-center gap-2" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}><MessageCircle size={14}/> Message</button>
                <button onClick={() => handleMeet(alumni.id)} className="btn-primary flex items-center gap-2" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}><Calendar size={14}/> Book Meet</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AlumniConnect;
