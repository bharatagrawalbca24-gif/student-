import React, { useState, useEffect, useContext, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Hash, MessageCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Brainstorming = () => {
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (activeTopic) fetchMessages(activeTopic.id);
  }, [activeTopic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchTopics = () => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/topics`)
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        if (data.length > 0 && !activeTopic) setActiveTopic(data[0]);
      })
      .catch(err => console.error("Failed to fetch topics", err));
  };

  const fetchMessages = (topicId) => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/topics/${topicId}/messages`)
      .then(res => res.json())
      .then(data => setChatMessages(data))
      .catch(err => console.error("Failed to fetch messages", err));
  };

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle) return toast.error("Please enter a title");
    
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTopicTitle, author: user?.name || 'Student' })
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
    if (!message || !activeTopic) return;
    
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/topics/${activeTopic.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message, author: user?.name || 'Student' })
    })
    .then(res => res.json())
    .then(data => {
      setChatMessages(prev => [...prev, data]);
      setMessage("");
      // Update replies count locally
      setTopics(prev => prev.map(t => t.id === activeTopic.id ? { ...t, replies: t.replies + 1 } : t));
    })
    .catch(() => toast.error("Failed to send message"));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="animate-fade-in delay-100 flex-col" style={{ height: '100%' }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title text-gradient m-0">Brainstorming Space</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-lg">+ New Discussion</button>
      </div>

      <div className="flex gap-8" style={{ flex: 1, minHeight: 0 }}>
        <div className="glass-panel flex-col animate-slide-up delay-200" style={{ width: '300px', overflowY: 'auto', padding: '1.5rem 1rem' }}>
          <h3 className="text-muted mb-4 font-semibold text-xs uppercase tracking-widest px-2 flex items-center gap-2">
            <MessageCircle size={14} /> Active Channels
          </h3>
          <div className="flex-col gap-2">
            {topics.map((topic) => (
              <motion.div 
                layout
                onClick={() => setActiveTopic(topic)}
                key={topic.id} 
                className={`flex flex-col p-3 rounded-xl cursor-pointer transition-all duration-300 ${activeTopic?.id === topic.id ? 'bg-primary/20 border border-primary/30' : 'hover:bg-white/5 border border-transparent'}`}
                style={{ 
                  borderLeft: activeTopic?.id === topic.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                }}>
                <h4 className={`font-semibold flex items-center gap-2 ${activeTopic?.id === topic.id ? 'text-primary' : 'text-secondary'}`}>
                  <Hash size={14} className="opacity-50" /> {topic.title}
                </h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] uppercase text-muted bg-black/20 px-2 py-1 rounded-md">{topic.author.split(' ')[0]}</span>
                  <span className="text-xs text-muted">{topic.replies} msg</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-panel flex-col animate-slide-up delay-300 relative overflow-hidden" style={{ flex: 1, padding: 0 }}>
          {activeTopic ? (
            <>
              <div className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-md z-10 shadow-md">
                <h3 className="text-2xl font-bold flex items-center gap-2"><Hash size={24} className="text-primary"/> {activeTopic.title}</h3>
                <p className="text-sm text-secondary mt-1">Started by <span className="text-primary">{activeTopic.author}</span></p>
              </div>
              
              <div className="flex-col flex-1 p-6 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
                {chatMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted flex-col gap-4 opacity-50">
                    <MessageCircle size={48} />
                    <p>No messages yet. Be the first to start the discussion!</p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => {
                    const isMe = msg.author === (user?.name || 'Student');
                    return (
                      <div key={idx} className={`flex flex-col mb-6 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-baseline gap-2 mb-1 px-1">
                          <span className={`text-xs font-bold ${isMe ? 'text-accent-primary' : 'text-secondary'}`}>{msg.author}</span>
                          <span className="text-[10px] text-muted">{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${isMe ? 'bg-primary/20 border border-primary/30 text-white rounded-tr-none shadow-lg' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none shadow-md'}`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 bg-black/20 border-t border-white/5 backdrop-blur-md">
                <div className="flex gap-3 relative">
                  <input 
                    type="text" 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={`Message #${activeTopic.title}`} 
                    className="w-full pr-12 shadow-inner"
                    style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '14px' }}
                  />
                  <button onClick={sendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-white transition-colors">
                    <Send size={20}/>
                  </button>
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-secondary text-lg flex-col gap-4">
               <Hash size={48} className="opacity-20" />
               Select a channel or create a new one to start brainstorming!
             </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="card w-full max-w-sm flex-col gap-6 p-loose shadow-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">New Discussion</h2>
                <button className="text-muted hover:text-white transition-colors" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateTopic} className="flex-col gap-4">
                <div className="flex-col gap-2">
                  <label className="text-sm text-secondary">Topic Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. React Architecture..." 
                    value={newTopicTitle} 
                    onChange={e => setNewTopicTitle(e.target.value)} 
                    className="w-full"
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-4 w-full">Create Channel</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Brainstorming;
