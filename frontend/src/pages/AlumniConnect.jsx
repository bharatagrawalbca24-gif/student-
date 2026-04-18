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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in delay-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title text-gradient m-0">Alumni Connect</h1>
        <div className="relative w-full max-w-sm">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Search alumni by name, role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {filteredAlumni.map((alumni, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={alumni.id} 
              className="card flex-col gap-4 animate-slide-up"
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg" 
                     style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  {alumni.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{alumni.name}</h3>
                  <p className="text-sm text-secondary flex items-center mt-1">
                    <Briefcase size={14} className="mr-1 text-muted" /> {alumni.role}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {alumni.expertise.map((skill, i) => (
                  <span key={i} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between mt-auto pt-4 border-t border-white/10">
                <button onClick={() => handleMessage(alumni.id)} className="btn btn-secondary text-sm">
                  <MessageCircle size={16}/> Message
                </button>
                <button onClick={() => handleMeet(alumni.id)} className="btn btn-primary text-sm">
                  <Calendar size={16}/> Book Meet
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AlumniConnect;
