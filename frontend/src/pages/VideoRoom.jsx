import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { AuthContext } from '../context/AuthContext';

const VideoRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const cleanRoomId = roomId.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate('/dashboard/sessions')} className="btn-secondary flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> Leave Meeting
        </button>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Secure Room: <span style={{ color: 'var(--accent-primary)' }}>{roomId}</span>
        </h2>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', padding: 0, display: 'flex', borderRadius: '16px' }}>
        <JitsiMeeting
            domain="meet.jit.si"
            roomName={`StudentDashboard_${cleanRoomId}`}
            userInfo={{
                displayName: user?.name || 'Student'
            }}
            configOverwrite={{
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startScreenSharing: true,
                enableEmailInStats: false
            }}
            interfaceConfigOverwrite={{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            }}
            getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; iframeRef.style.width = '100%'; iframeRef.style.border = 'none'; }}
        />
      </div>
    </motion.div>
  );
};

export default VideoRoom;
