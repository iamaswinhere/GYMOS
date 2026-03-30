const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  plan: { type: String, required: true },
  hasPT: { type: Boolean, default: false },
  status: { type: String, enum: ['new', 'contacted', 'member', 'archived'], default: 'new' },
  source: { type: String, default: 'landing_page' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
