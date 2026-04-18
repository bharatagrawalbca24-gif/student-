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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in delay-100 flex-col" style={{ height: '100%' }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title text-gradient m-0">Brainstorming Space</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">+ New Topic</button>
      </div>

      <div className="flex gap-8" style={{ flex: 1, minHeight: 0 }}>
        <div className="card p-tight flex-col animate-slide-up delay-200" style={{ flex: 1, overflowY: 'auto' }}>
          <h3 className="text-muted mb-4 font-semibold text-sm uppercase tracking-wider px-2">Active Discussions</h3>
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
                <h4 className={`font-semibold ${activeTopic?.id === topic.id ? 'text-primary' : 'text-secondary'}`}>{topic.title}</h4>
                <p className="text-xs mt-1 text-muted">{topic.replies} replies</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card flex-col p-loose animate-slide-up delay-300" style={{ flex: 2 }}>
          {activeTopic ? (
            <>
              <h3 className="text-2xl font-bold mb-6">{activeTopic.title}</h3>
              <div className="flex-col flex-1 bg-black/20 rounded-2xl p-4 mb-6 overflow-y-auto border border-white/5 shadow-inner">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2 w-fit max-w-[80%]">
                  <strong className="text-accent-secondary text-xs block mb-1 uppercase tracking-wider">{activeTopic.author}</strong>
                  <p className="text-sm">Let's discuss this!</p>
                </div>
              </div>
              <div className="flex gap-3 mt-auto">
                <input 
                  type="text" 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..." 
                  className="w-full"
                />
                <button onClick={sendMessage} className="btn btn-primary flex items-center justify-center p-3 rounded-xl"><Send size={18}/></button>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-secondary text-lg">
               Select a topic or create a new one!
             </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card w-full max-w-sm flex-col gap-6 p-loose">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">New Topic</h2>
              <button className="text-muted hover:text-white transition-colors" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateTopic} className="flex-col gap-4">
              <input 
                type="text" 
                placeholder="Topic Title..." 
                value={newTopicTitle} 
                onChange={e => setNewTopicTitle(e.target.value)} 
                className="w-full"
              />
              <button type="submit" className="btn btn-primary mt-4">Create Discussion</button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Brainstorming;
