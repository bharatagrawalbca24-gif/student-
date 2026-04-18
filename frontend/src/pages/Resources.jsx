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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in delay-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="section-title text-gradient m-0">Shared Resources</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Upload size={18} /> Upload Material
        </button>
      </div>

      <div className="relative w-full max-w-md mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search materials by title or subject..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
          style={{ paddingLeft: '3rem' }}
        />
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {filteredResources.map((res) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={res.id} 
              className="card flex-col gap-4" 
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  {getIcon(res.type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{res.title}</h3>
                  <p className="text-sm text-secondary">{res.subject}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                <span className="text-xs text-muted">By {res.uploadedBy}</span>
                <button 
                  onClick={() => toast.success(`Downloading ${res.title}...`)}
                  className="text-primary hover:text-white transition-colors duration-200 flex items-center gap-1 text-sm font-semibold"
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card w-full max-w-md flex-col gap-6 p-loose">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Upload Material</h2>
              <button className="text-muted hover:text-white" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleUpload} className="flex-col gap-4">
              <input type="text" placeholder="Title (e.g. Note Chap 4)" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <input type="text" placeholder="Subject (e.g. Physics)" value={newSubject} onChange={e => setNewSubject(e.target.value)} />
              <select value={newType} onChange={e => setNewType(e.target.value)}>
                <option value="Note">Note</option>
                <option value="Book">Book</option>
                <option value="Video">Video</option>
              </select>
              <button type="submit" className="btn btn-gradient mt-4">Upload</button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Resources;
