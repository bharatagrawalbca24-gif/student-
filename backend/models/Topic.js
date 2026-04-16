const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  replies: { type: Number, default: 0 },
  tags: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
