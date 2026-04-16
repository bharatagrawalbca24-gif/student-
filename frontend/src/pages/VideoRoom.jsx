import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> Leave Meeting
        </button>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Secure Room: <span style={{ color: 'var(--accent-primary)' }}>{roomId}</span>
        </h2>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', padding: 0, display: 'flex', borderRadius: '16px' }}>
        <iframe
          src={`https://meet.jit.si/student-dashboard-${roomId}#config.prejoinPageEnabled=false`}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '16px'
          }}
          title="Video Conferencing Room"
        />
      </div>
    </motion.div>
  );
};

export default VideoRoom;
