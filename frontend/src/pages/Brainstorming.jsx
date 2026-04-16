import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

const Brainstorming = () => {
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/topics`)
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        if (data.length > 0) setActiveTopic(data[0]);
      })
      .catch(err => console.error("Failed to fetch topics", err));
  }, []);

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle) return toast.error("Please enter a title");
    
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTopicTitle })
    })
    .then(res => res.json())
    .then(data => {
      setTopics(prev => [data, ...prev]);
      setActiveTopic(data);
      setIsModalOpen(false);
      setNewTopicTitle("");
      toast.success("Topic created!");
    });
  };

  const sendMessage = () => {
    if (!message) return;
    toast.success("Message sent! (Mocked)");
    setMessage("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Brainstorming Space</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">+ New Topic</button>
      </div>

      <div className="flex gap-6" style={{ flex: 1, minHeight: 0 }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Active Discussions</h3>
          <div className="flex-col gap-2">
            {topics.map((topic) => (
              <motion.div 
                layout
                onClick={() => setActiveTopic(topic)}
                key={topic.id} 
                style={{ 
                  padding: '1rem', 
                  background: activeTopic?.id === topic.id ? 'rgba(139, 92, 246, 0.15)' : 'var(--glass-bg)', 
                  borderLeft: activeTopic?.id === topic.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}>
                <h4 style={{ color: activeTopic?.id === topic.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{topic.title}</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{topic.replies} replies</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-panel flex-col" style={{ flex: 2, padding: '1.5rem' }}>
          {activeTopic ? (
            <>
              <h3 style={{ marginBottom: '1rem' }}>{activeTopic.title}</h3>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', overflowY: 'auto', border: '1px solid var(--glass-border)' }}>
                <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginBottom: '0.5rem', width: 'fit-content' }}>
                  <strong style={{ color: 'var(--accent-secondary)', display: 'block', fontSize: '0.8rem' }}>{activeTopic.author}</strong>
                  Let's discuss this!
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..." 
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button onClick={sendMessage} className="btn-primary flex items-center justify-center"><Send size={18}/></button>
              </div>
            </>
          ) : (
             <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'}}>
               Select a topic or create a new one!
             </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex justify-between items-center">
              <h2>New Topic</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-white" /></button>
            </div>
            <form onSubmit={handleCreateTopic} className="flex-col gap-4">
              <input 
                type="text" 
                placeholder="Topic Title..." 
                value={newTopicTitle} 
                onChange={e => setNewTopicTitle(e.target.value)} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', outline: 'none' }} 
              />
              <button type="submit" className="btn-primary mt-2">Create Discussion</button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Brainstorming;
