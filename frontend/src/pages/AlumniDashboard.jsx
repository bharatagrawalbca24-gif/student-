import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CalendarCheck, MessageSquare, Target } from 'lucide-react';

const AlumniDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="animate-fade-in delay-100">
      <h1 className="section-title text-gradient">Alumni Dashboard</h1>
      
      <div className="card p-loose mb-8 animate-slide-up delay-200">
        <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name?.split(' ')[0] || 'Alumni'}!</h2>
        <p className="text-secondary">Thank you for contributing to Gyan and mentoring the next generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up delay-300">
        <div className="card p-loose flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <MessageSquare size={24} />
            <h3 className="font-semibold text-lg">Mentorship Requests</h3>
          </div>
          <p className="text-4xl font-bold">3</p>
          <p className="text-sm text-secondary">Pending approval</p>
        </div>
        
        <div className="card p-loose flex flex-col gap-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CalendarCheck size={24} />
            <h3 className="font-semibold text-lg">Upcoming Sessions</h3>
          </div>
          <p className="text-4xl font-bold">1</p>
          <p className="text-sm text-secondary">Scheduled for this week</p>
        </div>

        <div className="card p-loose flex flex-col gap-4">
          <div className="flex items-center gap-3 text-purple-400">
            <Target size={24} />
            <h3 className="font-semibold text-lg">Impact Score</h3>
          </div>
          <p className="text-4xl font-bold">850</p>
          <p className="text-sm text-secondary">Top 5% of mentors</p>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
