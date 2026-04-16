import React, { useEffect, useState } from 'react';
import { Book, FileText, Video, Download, Upload, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newType, setNewType] = useState("Note");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/resources`)
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(err => {
        console.error("Failed to fetch resources", err);
        toast.error("Failed to load resources");
      });
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newTitle || !newSubject) return toast.error("Please fill all fields");
    
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, subject: newSubject, type: newType })
    })
    .then(res => res.json())
    .then(data => {
      setResources(prev => [...prev, data]);
      setIsModalOpen(false);
      setNewTitle("");
      setNewSubject("");
      toast.success("Material uploaded successfully!");
    })
    .catch(() => toast.error("Upload failed"));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Book': return <Book className="text-blue-400" size={24} style={{color: 'var(--accent-secondary)'}} />;
      case 'Note': return <FileText className="text-purple-400" size={24} style={{color: 'var(--accent-primary)'}} />;
      case 'Video': return <Video className="text-red-400" size={24} style={{color: 'var(--accent-danger)'}} />;
      default: return <FileText size={24} />;
    }
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in">
      <div className="flex justify-between items-center" style={{marginBottom: '2rem'}}>
        <h1 className="section-title" style={{margin: 0}}>Shared Resources</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Upload size={18} /> Upload Material
        </button>
      </div>

      <div style={{ marginBottom: '2rem', position: 'relative', width: '100%', maxWidth: '400px' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search materials by title or subject..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '0.8rem 1rem 0.8rem 3rem', 
            borderRadius: '999px',
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {filteredResources.map((res) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={res.id} 
              className="glass-panel" 
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div className="flex items-center gap-4">
                <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                  {getIcon(res.type)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{res.title}</h3>
                  <p style={{ fontSize: '0.85rem' }}>{res.subject}</p>
                </div>
              </div>
              <div className="flex justify-between items-center" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>By {res.uploadedBy}</span>
                <button 
                  onClick={() => toast.success(`Downloading ${res.title}...`)}
                  style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex justify-between items-center">
              <h2>Upload Material</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-white" /></button>
            </div>
            <form onSubmit={handleUpload} className="flex-col gap-4">
              <input type="text" placeholder="Title (e.g. Note Chap 4)" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Subject (e.g. Physics)" value={newSubject} onChange={e => setNewSubject(e.target.value)} style={inputStyle} />
              <select value={newType} onChange={e => setNewType(e.target.value)} style={inputStyle}>
                <option value="Note">Note</option>
                <option value="Book">Book</option>
                <option value="Video">Video</option>
              </select>
              <button type="submit" className="btn-primary mt-2">Upload</button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const inputStyle = {
  width: '100%', padding: '0.8rem', borderRadius: '8px', 
  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', 
  color: 'var(--text-primary)', outline: 'none'
};

export default Resources;
