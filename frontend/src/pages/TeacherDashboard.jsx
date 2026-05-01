import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, BookOpen, ClipboardList, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);

  const assignmentData = [
    { name: 'Week 1', submitted: 120, total: 142 },
    { name: 'Week 2', submitted: 135, total: 142 },
    { name: 'Week 3', submitted: 110, total: 142 },
    { name: 'Week 4', submitted: 140, total: 142 },
  ];

  return (
    <div className="animate-fade-in delay-100">
      <h1 className="section-title text-gradient">Teacher Overview</h1>
      
      <div className="card p-loose mb-8 animate-slide-up delay-200">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Professor {user?.name?.split(' ')[0] || ''}!</h2>
        <p className="text-secondary">Here is an overview of your classes and pending tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up delay-300">
        <div className="card p-loose flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <Users size={24} />
            <h3 className="font-semibold text-lg">Total Students</h3>
          </div>
          <p className="text-4xl font-bold">142</p>
        </div>
        
        <div className="card p-loose flex flex-col gap-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle size={24} />
            <h3 className="font-semibold text-lg">Assignments Graded</h3>
          </div>
          <p className="text-4xl font-bold">85%</p>
        </div>

        <div className="card p-loose flex flex-col gap-4">
          <div className="flex items-center gap-3 text-blue-400">
            <BookOpen size={24} />
            <h3 className="font-semibold text-lg">Active Resources</h3>
          </div>
          <p className="text-4xl font-bold">24</p>
        </div>

        <div className="card p-loose flex flex-col gap-4">
          <div className="flex items-center gap-3 text-orange-400">
            <ClipboardList size={24} />
            <h3 className="font-semibold text-lg">Pending Requests</h3>
          </div>
          <p className="text-4xl font-bold">7</p>
        </div>
      </div>

      <div className="card p-loose animate-slide-up delay-400">
        <h3 className="text-muted mb-6 font-semibold text-sm uppercase tracking-wider">Assignment Submissions (Last 4 Weeks)</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assignmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="total" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Total Students" />
              <Bar dataKey="submitted" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} name="Submitted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
