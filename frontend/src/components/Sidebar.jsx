import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, HelpCircle, Lightbulb, Users, BookOpen, ClipboardList, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
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
        <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), #db2777)', padding: '10px', borderRadius: '12px', color: '#fff', display: 'flex', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)' }}>
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
      
      <div className="mt-auto flex-col gap-4">
        <div className="card p-tight pulse-glow" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-secondary)' }} />
          <p className="text-muted text-sm mb-1">Upcoming Session</p>
          <p className="font-semibold text-primary mb-1">React Hooks Deep Dive</p>
          <p className="text-sm" style={{ color: 'var(--accent-secondary)' }}>Tomorrow, 10:00 AM</p>
        </div>

        <div className="card p-tight flex justify-between items-center" style={{ background: 'rgba(0,0,0,0.2)', border: 'none' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-col">
              <span className="text-sm font-semibold truncate w-24">{user?.name || 'Student'}</span>
            </div>
          </div>
          <button onClick={logout} className="text-muted hover:text-red-400 transition-colors p-2" title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
