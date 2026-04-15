const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Doubt Session', 'Brainstorming', 'Senior Consultant'], required: true },
  mentor: { type: String, required: true }, // e.g., Professor's name or Senior Consultant's name
  topic: { type: String },
  date: { type: Date, required: true },
  meetLink: { type: String },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
