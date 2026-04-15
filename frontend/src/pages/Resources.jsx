import React, { useEffect, useState } from 'react';
import { Book, FileText, Video, Download } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/resources')
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(err => console.error("Failed to fetch resources", err));
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'Book': return <Book className="text-blue-400" size={24} style={{color: 'var(--accent-secondary)'}} />;
      case 'Note': return <FileText className="text-purple-400" size={24} style={{color: 'var(--accent-primary)'}} />;
      case 'Video': return <Video className="text-red-400" size={24} style={{color: 'var(--accent-danger)'}} />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{marginBottom: '2rem'}}>
        <h1 className="section-title" style={{margin: 0}}>Shared Resources</h1>
        <button className="btn-primary flex items-center gap-2">
          Upload Material
        </button>
      </div>

      <div className="grid" style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem'
      }}>
        {resources.map((res) => (
          <div key={res.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              <button style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Download size={16} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
