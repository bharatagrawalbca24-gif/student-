import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import DoubtSessions from './pages/DoubtSessions';
import Brainstorming from './pages/Brainstorming';
import AlumniConnect from './pages/AlumniConnect';
import Resources from './pages/Resources';
import Assignments from './pages/Assignments';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/sessions" element={<DoubtSessions />} />
          <Route path="/brainstorming" element={<Brainstorming />} />
          <Route path="/alumni" element={<AlumniConnect />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/assignments" element={<Assignments />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
