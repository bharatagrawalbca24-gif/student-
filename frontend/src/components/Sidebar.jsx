import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, HelpCircle, Lightbulb, Users, BookOpen, ClipboardList } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/attendance', label: 'Attendance', icon: <CalendarCheck size={20} /> },
    { path: '/resources', label: 'Resources', icon: <BookOpen size={20} /> },
    { path: '/assignments', label: 'Assignments', icon: <ClipboardList size={20} /> },
    { path: '/sessions', label: 'Doubt Sessions', icon: <HelpCircle size={20} /> },
    { path: '/brainstorming', label: 'Brainstorming', icon: <Lightbulb size={20} /> },
    { path: '/alumni', label: 'Alumni Connect', icon: <Users size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '8px', color: '#fff', display: 'flex' }}>
          <LayoutDashboard size={24} />
        </div>
        StudentHub
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Upcoming Session</p>
        <p style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.9rem' }}>React Hooks Deep Dive</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>Tomorrow, 10:00 AM</p>
      </div>
    </aside>
  );
};

export default Sidebar;
