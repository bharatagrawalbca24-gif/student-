const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // Allow requests from Vercel deployed app (or all if not set)
app.use(express.json());

// Models
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Resource = require('./models/Resource');
const Session = require('./models/Session');
const Topic = require('./models/Topic');
const Alumni = require('./models/Alumni');

// Mock Data Storage (Fallback if DB not used)
let mockData = {
    attendance: [
        { subject: 'Computer Networks', totalClasses: 40, attendedClasses: 28 },
        { subject: 'Operating Systems', totalClasses: 35, attendedClasses: 30 },
        { subject: 'Database Systems', totalClasses: 38, attendedClasses: 29 },
        { subject: 'Software Engineering', totalClasses: 32, attendedClasses: 30 }
    ],
    sessions: [
        { id: 1, title: 'React Hooks Deep Dive', type: 'Doubt Session', topic: 'Frontend React', mentor: 'Prof. Alan', date: '2026-04-18T10:00:00Z', status: 'Upcoming' },
        { id: 2, title: 'System Design Patterns', type: 'Brainstorming', topic: 'Distributed Systems', mentor: 'Student Peer Group', date: '2026-04-19T14:30:00Z', status: 'Upcoming' },
        { id: 3, title: 'Career Guidance', type: 'Senior Consultant', topic: 'Placements', mentor: 'Sarah Jenkins', date: '2026-04-20T11:00:00Z', status: 'Upcoming' }
    ],
    alumni: [
        { id: 1, name: 'Sarah Jenkins', role: 'Software Engineer @ Google', expertise: ['Frontend', 'React'] },
        { id: 2, name: 'David Chen', role: 'Backend Engineer @ Stripe', expertise: ['Node.js', 'System Design'] }
    ],
    assignments: [
        { id: 1, title: 'Network Topologies', subject: 'Computer Networks', topic: 'Topology', dueDate: '2026-04-22T23:59:00Z', status: 'Pending' },
        { id: 2, title: 'Process Scheduling', subject: 'Operating Systems', topic: 'CPU Scheduling', dueDate: '2026-04-16T23:59:00Z', status: 'Submitted' },
        { id: 3, title: 'SQL Queries', subject: 'Database Systems', topic: 'Normalization', dueDate: '2026-04-25T23:59:00Z', status: 'Pending' }
    ],
    resources: [
        { id: 1, title: 'OS Concepts 10th Ed.', type: 'Book', subject: 'Operating Systems', uploadedBy: 'Prof. Alan', url: '#' },
        { id: 2, title: 'CN Chapter 3 Notes', type: 'Note', subject: 'Computer Networks', uploadedBy: 'Alex Doe', url: '#' },
        { id: 3, title: 'SQL Best Practices', type: 'Video', subject: 'Database Systems', uploadedBy: 'Sarah Jenkins', url: '#' }
    ],
    topics: [
        { id: 1, title: 'Best practices for React components', author: 'Alex Doe', replies: 12, tags: ['React', 'Frontend'] },
        { id: 2, title: 'How to prepare for System Design interviews', author: 'Sarah Jenkins', replies: 8, tags: ['System Design', 'Interview'] }
    ]
};

// Database connection attempt
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-dashboard')
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.log('MongoDB connection failed (Using Mock Data Fallback):', err.message));

// Helper check
const isDbConnected = () => mongoose.connection.readyState === 1;

const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running successfully', mode: isDbConnected() ? 'DATABASE' : 'MOCK_FALLBACK' });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        if (!isDbConnected()) return res.status(500).json({ error: 'Database is not connected.' });
        const { name, email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        if (!isDbConnected()) return res.status(500).json({ error: 'Database is not connected.' });
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid Credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });
        
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.get('/api/dashboard', async (req, res) => {
    let totalClasses = 0;
    let totalAttended = 0;
    
    mockData.attendance.forEach(sub => {
        totalClasses += sub.totalClasses;
        totalAttended += sub.attendedClasses;
    });
    
    const overallAttendance = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);

    let upcomingSessions = mockData.sessions.slice(0, 2);
    
    if (isDbConnected()) {
        try {
            upcomingSessions = await Session.find().limit(2);
        } catch(e) { console.error(e) }
    }

    res.json({
        user: { name: 'Alex Doe', semester: '6th Sem', major: 'Computer Science' },
        overallAttendance,
        attendanceDetails: mockData.attendance, // Keep hardcoded attendance for now
        upcomingSessions
    });
});

app.get('/api/attendance', (req, res) => res.json(mockData.attendance));

app.get('/api/sessions', async (req, res) => {
    if (isDbConnected()) {
        try {
            const sessions = await Session.find();
            return res.json(sessions.map(s => ({
                 id: s._id.toString(),
                 title: s.title,
                 type: s.type,
                 topic: s.topic,
                 mentor: s.mentor,
                 date: s.date,
                 status: s.status
            })));
        } catch(e) { console.error(e) }
    }
    res.json(mockData.sessions);
});

app.get('/api/alumni', async (req, res) => {
    if (isDbConnected()) {
        try {
            const alumni = await Alumni.find();
            return res.json(alumni.map(a => ({
                 id: a._id.toString(),
                 name: a.name,
                 role: a.role,
                 expertise: a.expertise
            })));
        } catch(e) { console.error(e) }
    }
    res.json(mockData.alumni);
});

app.get('/api/assignments', async (req, res) => {
    if (isDbConnected()) {
        try {
            const assignments = await Assignment.find().populate('subject', 'title');
            // Reformat to match UI expectations if necessary
            const formatted = assignments.map(a => ({
                id: a._id.toString(),
                title: a.title,
                subject: a.subject?.title || 'Unknown Subject',
                topic: a.topic,
                dueDate: a.dueDate,
                status: a.status
            }));
            return res.json(formatted);
        } catch(e) { console.error(e) }
    }
    res.json(mockData.assignments);
});

app.post('/api/assignments/:id/submit', async (req, res) => {
    if (isDbConnected()) {
        try {
            const updated = await Assignment.findByIdAndUpdate(req.params.id, { status: 'Submitted' }, { new: true });
            if (updated) {
                return res.json({ id: updated._id.toString(), status: updated.status });
            }
        } catch(e) { console.error("Could not update via mongoose fallback to mock") }
    }
    
    const id = parseInt(req.params.id);
    const assignment = mockData.assignments.find(a => a.id === id);
    if (assignment) assignment.status = 'Submitted';
    res.json(assignment);
});

app.get('/api/resources', async (req, res) => {
    if (isDbConnected()) {
        try {
            const resources = await Resource.find().populate('subject', 'title');
            const formatted = resources.map(r => ({
                id: r._id.toString(),
                title: r.title,
                type: r.type,
                subject: r.subject?.title || 'General',
                uploadedBy: r.uploadedBy
            }));
            return res.json(formatted);
        } catch(e) { console.error(e) }
    }
    res.json(mockData.resources);
});

app.post('/api/resources', async (req, res) => {
    if (isDbConnected()) {
        try {
            const newRes = await Resource.create({
                title: req.body.title,
                type: req.body.type,
                uploadedBy: req.body.uploadedBy || 'Alex Doe',
                url: '#'
            });
            return res.json({ id: newRes._id.toString(), ...req.body, uploadedBy: newRes.uploadedBy });
        } catch(e) { console.error("Could not upload via mongoose fallback to mock", e) }
    }
    const newResource = {
        id: Date.now(),
        ...req.body,
        uploadedBy: req.body.uploadedBy || 'Alex Doe',
        url: '#'
    };
    mockData.resources.push(newResource);
    res.json(newResource);
});

app.post('/api/sessions/:id/book', async (req, res) => {
    if (isDbConnected()) {
        try {
            const updated = await Session.findByIdAndUpdate(req.params.id, { status: 'Booked' }, { new: true });
            if (updated) {
                return res.json({ id: updated._id.toString(), status: updated.status, mentor: updated.mentor, date: updated.date, type: updated.type, title: updated.title });
            }
        } catch(e) { console.error("Session update failed, fallback to mock") }
    }
    const id = parseInt(req.params.id);
    const session = mockData.sessions.find(s => s.id === id);
    if (session) {
        session.status = 'Booked';
        return res.json(session);
    }
    res.status(404).json({ error: 'Session not found' });
});

app.get('/api/topics', async (req, res) => {
    if (isDbConnected()) {
        try {
            const topics = await Topic.find().sort({ createdAt: -1 });
            return res.json(topics.map(t => ({
                id: t._id.toString(),
                title: t.title,
                author: t.author,
                replies: t.replies,
                tags: t.tags
            })));
        } catch(e) { console.error(e) }
    }
    res.json(mockData.topics);
});

app.post('/api/topics', async (req, res) => {
    if (isDbConnected()) {
        try {
            const newTopic = await Topic.create({
                title: req.body.title,
                author: 'Alex Doe',
                tags: req.body.tags || []
            });
            return res.json({
                id: newTopic._id.toString(),
                title: newTopic.title,
                author: newTopic.author,
                replies: newTopic.replies,
                tags: newTopic.tags
            });
        } catch(e) { console.error(e) }
    }
    const newTopic = {
        id: Date.now(),
        title: req.body.title,
        author: 'Alex Doe',
        replies: 0,
        tags: req.body.tags || []
    };
    mockData.topics.unshift(newTopic);
    res.json(newTopic);
});

app.post('/api/alumni/:id/message', (req, res) => {
    res.json({ success: true, message: 'Message sent successfully!' });
});

app.post('/api/alumni/:id/meet', (req, res) => {
    res.json({ success: true, message: 'Meeting requested successfully!' });
});

// We no longer serve frontend via static in production since we use Vercel for the frontend.
// The code below is removed. Render will act SOLELY as an API server.
app.get('/', (req, res) => { res.send("Student Dashboard API is Running.") });

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
