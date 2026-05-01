import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import Attendance from './pages/Attendance';
import DoubtSessions from './pages/DoubtSessions';
import Brainstorming from './pages/Brainstorming';
import AlumniConnect from './pages/AlumniConnect';
import Resources from './pages/Resources';
import Assignments from './pages/Assignments';
import VideoRoom from './pages/VideoRoom';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';

const RoleBasedDashboard = () => {
  const { user } = useContext(AuthContext);
  if (user?.role === 'teacher') return <TeacherDashboard />;
  if (user?.role === 'alumni') return <AlumniDashboard />;
  return <StudentDashboard />;
};

const ProtectedLayout = () => (
  <ProtectedRoute>
    <div className="app-bg"></div>
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<RoleBasedDashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/sessions" element={<DoubtSessions />} />
          <Route path="/brainstorming" element={<Brainstorming />} />
          <Route path="/alumni" element={<AlumniConnect />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/meet/:roomId" element={<VideoRoom />} />
        </Routes>
      </main>
    </div>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'var(--glass-bg)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          fontFamily: 'Inter, sans-serif'
        }
      }} />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
