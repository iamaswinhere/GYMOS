const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true }, // Simplified Date (includes time)
  location: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
  createdBy: { type: String, default: 'Admin' }
}, { timestamps: true });

// TTL Index: Deletes the event 24 hours (86400 seconds) after the 'date' value
eventSchema.index({ date: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Event', eventSchema);
