const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // Allow requests from Vercel explicitly
app.use(express.json());

// Models
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Resource = require('./models/Resource');
const Session = require('./models/Session');
const Topic = require('./models/Topic');
const Alumni = require('./models/Alumni');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Database connection attempt
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-dashboard')
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.error('MongoDB connection failed:', err.message));

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running successfully', mode: 'DATABASE' });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
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
        console.error("Register Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
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
        console.error("Login Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// Core App Routes
app.get('/api/dashboard', async (req, res) => {
    try {
        const attendanceData = await Attendance.find();
        let totalClasses = 0;
        let totalAttended = 0;
        
        attendanceData.forEach(sub => {
            totalClasses += sub.totalClasses;
            totalAttended += sub.attendedClasses;
        });
        
        const overallAttendance = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);

        const upcomingSessions = await Session.find().limit(2);

        res.json({
            overallAttendance,
            attendanceDetails: attendanceData,
            upcomingSessions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/attendance', async (req, res) => {
    try {
        const data = await Attendance.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/sessions', async (req, res) => {
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sessions/:id/book', async (req, res) => {
    try {
        const updated = await Session.findByIdAndUpdate(req.params.id, { status: 'Booked' }, { new: true });
        if (updated) {
            return res.json({ id: updated._id.toString(), status: updated.status, mentor: updated.mentor, date: updated.date, type: updated.type, title: updated.title });
        }
        res.status(404).json({ error: 'Session not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/alumni', async (req, res) => {
    try {
        const alumni = await Alumni.find();
        return res.json(alumni.map(a => ({
            id: a._id.toString(),
            name: a.name,
            role: a.role,
            expertise: a.expertise
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/alumni/:id/message', (req, res) => {
    res.json({ success: true, message: 'Message sent successfully!' });
});

app.post('/api/alumni/:id/meet', (req, res) => {
    res.json({ success: true, message: 'Meeting requested successfully!' });
});

app.get('/api/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find().populate('subject', 'title');
        const formatted = assignments.map(a => ({
            id: a._id.toString(),
            title: a.title,
            subject: a.subject?.title || 'General',
            topic: a.topic,
            dueDate: a.dueDate,
            status: a.status
        }));
        return res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/assignments/:id/submit', async (req, res) => {
    try {
        const updated = await Assignment.findByIdAndUpdate(req.params.id, { status: 'Submitted' }, { new: true });
        if (updated) {
            return res.json({ id: updated._id.toString(), status: updated.status });
        }
        res.status(404).json({ error: 'Assignment not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/resources', async (req, res) => {
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/resources', async (req, res) => {
    try {
        const newRes = await Resource.create({
            title: req.body.title,
            type: req.body.type,
            uploadedBy: req.body.uploadedBy || 'Anonymous',
            url: '#'
        });
        return res.json({ id: newRes._id.toString(), title: newRes.title, type: newRes.type, uploadedBy: newRes.uploadedBy });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/topics', async (req, res) => {
    try {
        const topics = await Topic.find().sort({ createdAt: -1 });
        return res.json(topics.map(t => ({
            id: t._id.toString(),
            title: t.title,
            author: t.author,
            replies: t.replies,
            tags: t.tags
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/topics', async (req, res) => {
    try {
        const newTopic = await Topic.create({
            title: req.body.title,
            author: 'Anonymous',
            tags: req.body.tags || []
        });
        return res.json({
            id: newTopic._id.toString(),
            title: newTopic.title,
            author: newTopic.author,
            replies: newTopic.replies,
            tags: newTopic.tags
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
