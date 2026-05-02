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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in delay-100 h-full flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="section-title text-gradient m-0">Alumni Network</h1>
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/70" />
          <input 
            type="text" 
            placeholder="Search by name or company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full shadow-inner"
            style={{ 
              paddingLeft: '2.8rem', 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '99px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2 pb-4">
        <AnimatePresence>
          {filteredAlumni.map((alumni, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={alumni.id} 
              className="card flex-col gap-5 bg-black/40 hover:bg-black/60 shadow-lg border-white/5 hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl border border-white/10" 
                     style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  {alumni.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{alumni.name}</h3>
                  <p className="text-sm text-secondary flex items-center mt-1 font-medium">
                    <Briefcase size={14} className="mr-1.5 text-primary/70" /> {alumni.role}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {alumni.expertise.map((skill, i) => (
                  <span key={i} className="text-[10px] uppercase font-bold bg-primary/10 px-2.5 py-1.5 rounded-lg text-primary border border-primary/20 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between mt-auto pt-4 border-t border-white/5 gap-3">
                <button onClick={() => handleMessage(alumni.id)} className="flex-1 btn btn-secondary text-sm flex justify-center items-center gap-2 hover:bg-white/10 border-white/10">
                  <MessageCircle size={16}/> Chat
                </button>
                <button onClick={() => handleMeet(alumni.id)} className="flex-1 btn btn-primary text-sm flex justify-center items-center gap-2 shadow-md">
                  <Calendar size={16}/> Meet
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredAlumni.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl bg-black/20 text-muted gap-4">
            <Search size={48} className="opacity-20" />
            <p className="text-lg">No alumni found matching your search.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AlumniConnect;
