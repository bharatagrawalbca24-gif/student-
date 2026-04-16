const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Resource = require('./models/Resource');
const Session = require('./models/Session');
const Topic = require('./models/Topic');
const Alumni = require('./models/Alumni');

dotenv.config();

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-dashboard';

mongoose.connect(dbUri)
  .then(async () => {
    console.log('MongoDB connection established successfully for seeding');

    // Clear existing data
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Resource.deleteMany({});
    await Session.deleteMany({});
    await Topic.deleteMany({});
    await Alumni.deleteMany({});

    console.log('Cleared existing collections');

    // Seed Courses
    const cnCourse = await Course.create({ title: 'Computer Networks', code: 'CS301', totalClasses: 40 });
    const osCourse = await Course.create({ title: 'Operating Systems', code: 'CS302', totalClasses: 35 });
    const dbCourse = await Course.create({ title: 'Database Systems', code: 'CS303', totalClasses: 38 });
    const seCourse = await Course.create({ title: 'Software Engineering', code: 'CS304', totalClasses: 32 });

    // Seed Assignments
    await Assignment.create([
      { title: 'Network Topologies', subject: cnCourse._id, topic: 'Topology', dueDate: new Date('2026-04-22T23:59:00Z'), status: 'Pending' },
      { title: 'Process Scheduling', subject: osCourse._id, topic: 'CPU Scheduling', dueDate: new Date('2026-04-16T23:59:00Z'), status: 'Submitted' },
      { title: 'SQL Queries', subject: dbCourse._id, topic: 'Normalization', dueDate: new Date('2026-04-25T23:59:00Z'), status: 'Pending' }
    ]);

    // Seed Resources
    await Resource.create([
      { title: 'OS Concepts 10th Ed.', type: 'Book', subject: osCourse._id, uploadedBy: 'Prof. Alan' },
      { title: 'CN Chapter 3 Notes', type: 'Note', subject: cnCourse._id, uploadedBy: 'Alex Doe' },
      { title: 'SQL Best Practices', type: 'Video', subject: dbCourse._id, uploadedBy: 'Sarah Jenkins' }
    ]);

    // Seed Sessions
    await Session.create([
      { title: 'React Hooks Deep Dive', type: 'Doubt Session', topic: 'Frontend React', mentor: 'Prof. Alan', date: new Date('2026-04-18T10:00:00Z'), status: 'Upcoming' },
      { title: 'System Design Patterns', type: 'Brainstorming', topic: 'Distributed Systems', mentor: 'Student Peer Group', date: new Date('2026-04-19T14:30:00Z'), status: 'Upcoming' },
      { title: 'Career Guidance', type: 'Senior Consultant', topic: 'Placements', mentor: 'Sarah Jenkins', date: new Date('2026-04-20T11:00:00Z'), status: 'Upcoming' }
    ]);

    // Seed Topics
    await Topic.create([
      { title: 'Best practices for React components', author: 'Alex Doe', replies: 12, tags: ['React', 'Frontend'] },
      { title: 'How to prepare for System Design interviews', author: 'Sarah Jenkins', replies: 8, tags: ['System Design', 'Interview'] }
    ]);

    // Seed Alumni
    await Alumni.create([
      { name: 'Sarah Jenkins', role: 'Software Engineer @ Google', expertise: ['Frontend', 'React'] },
      { name: 'David Chen', role: 'Backend Engineer @ Stripe', expertise: ['Node.js', 'System Design'] }
    ]);

    console.log('Database successfully seeded!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to seed Database (Is MongoDB running?):', err.message);
    process.exit(1);
  });
