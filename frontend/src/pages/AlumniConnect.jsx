import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';

const AlumniConnect = () => {
  const [alumniData, setAlumniData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/alumni')
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

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>Alumni Connect</h1>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search alumni by name, role..." 
            style={{ 
              padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
              borderRadius: '8px', 
              border: '1px solid rgba(0,0,0,0.1)', 
              background: '#ffffff', 
              color: 'var(--text-primary)', 
              outline: 'none',
              width: '300px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {alumniData.map((alumni, idx) => (
          <div key={alumni.id} className="glass-panel animate-slide-up" style={{ padding: '1.5rem', animationDelay: `${idx * 0.1}s`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                <span key={i} style={{ padding: '0.2rem 0.5rem', background: 'rgba(135,153,130,0.1)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-auto" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Message</button>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Book Meet</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniConnect;
