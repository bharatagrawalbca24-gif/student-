const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Note', 'Book', 'Video', 'Other'], required: true },
  url: { type: String },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  uploadedBy: { type: String, default: 'Anonymous' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
