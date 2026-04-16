const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  expertise: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);
