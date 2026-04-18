const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Resource = require('./models/Resource');
const Session = require('./models/Session');
const Topic = require('./models/Topic');
const Alumni = require('./models/Alumni');

// Extracted from server.js
const mockData = {
    courses: [
        { title: 'Computer Networks', code: 'CS301', totalClasses: 40 },
        { title: 'Operating Systems', code: 'CS302', totalClasses: 35 },
        { title: 'Database Systems', code: 'CS303', totalClasses: 38 },
        { title: 'Software Engineering', code: 'CS304', totalClasses: 32 }
    ],
    sessions: [
        { title: 'React Hooks Deep Dive', type: 'Doubt Session', topic: 'Frontend React', mentor: 'Prof. Alan', date: new Date('2026-04-18T10:00:00Z'), status: 'Upcoming' },
        { title: 'System Design Patterns', type: 'Brainstorming', topic: 'Distributed Systems', mentor: 'Student Peer Group', date: new Date('2026-04-19T14:30:00Z'), status: 'Upcoming' },
        { title: 'Career Guidance', type: 'Senior Consultant', topic: 'Placements', mentor: 'Sarah Jenkins', date: new Date('2026-04-20T11:00:00Z'), status: 'Upcoming' }
    ],
    alumni: [
        { name: 'Sarah Jenkins', role: 'Software Engineer @ Google', expertise: ['Frontend', 'React'] },
        { name: 'David Chen', role: 'Backend Engineer @ Stripe', expertise: ['Node.js', 'System Design'] }
    ],
    assignments: [
        { title: 'Network Topologies', topic: 'Topology', dueDate: new Date('2026-04-22T23:59:00Z'), status: 'Pending' },
        { title: 'Process Scheduling', topic: 'CPU Scheduling', dueDate: new Date('2026-04-16T23:59:00Z'), status: 'Submitted' },
        { title: 'SQL Queries', topic: 'Normalization', dueDate: new Date('2026-04-25T23:59:00Z'), status: 'Pending' }
    ],
    resources: [
        { title: 'OS Concepts 10th Ed.', type: 'Book', uploadedBy: 'Prof. Alan', url: '#' },
        { title: 'CN Chapter 3 Notes', type: 'Note', uploadedBy: 'Alex Doe', url: '#' },
        { title: 'SQL Best Practices', type: 'Video', uploadedBy: 'Sarah Jenkins', url: '#' }
    ],
    topics: [
        { title: 'Best practices for React components', author: 'Alex Doe', replies: 12, tags: ['React', 'Frontend'] },
        { title: 'How to prepare for System Design interviews', author: 'Sarah Jenkins', replies: 8, tags: ['System Design', 'Interview'] }
    ]
};

const seedDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://himanshiwork4_db_user:Arshii%402@cluster0.ovmbbpz.mongodb.net/student-dashboard?appName=Cluster0');
        console.log('Connected to MongoDB Atlas');

        // Clear existing collections safely
        await Course.deleteMany({});
        await Assignment.deleteMany({});
        await Resource.deleteMany({});
        await Session.deleteMany({});
        await Topic.deleteMany({});
        await Alumni.deleteMany({});
        console.log('Cleared existing collections');

        // Insert primary models
        const insertedCourses = await Course.insertMany(mockData.courses);
        await Session.insertMany(mockData.sessions);
        await Topic.insertMany(mockData.topics);
        await Alumni.insertMany(mockData.alumni);

        // Bind references for assignments
        const assignmentsWithRefs = mockData.assignments.map((a, i) => {
            // Assign a subject based on index for variety
            a.subject = insertedCourses[i % insertedCourses.length]._id;
            return a;
        });
        await Assignment.insertMany(assignmentsWithRefs);

        // Bind references for resources
        const resourcesWithRefs = mockData.resources.map((r, i) => {
            r.subject = insertedCourses[i % insertedCourses.length]._id;
            return r;
        });
        await Resource.insertMany(resourcesWithRefs);

        console.log('Successfully seeded database!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to seed database:', err);
        process.exit(1);
    }
};

seedDatabase();
