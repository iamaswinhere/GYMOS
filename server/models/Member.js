const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String },
  dateOfBirth: { type: Date },
  joiningDate: { type: Date, default: Date.now },
  membershipStatus: { 
    type: String, 
    enum: ['active', 'expired', 'stopped', 'pending'], 
    default: 'active' 
  },
  membershipPlan: {
    name: { type: String, required: true },
    durationMonths: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  lastRenewalDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  photoUrl: { type: String },
  notes: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  address: { type: String },
  emergencyContact: { type: String },
  height: { type: Number },
  weight: { type: Number },
  bloodGroup: { type: String },
  medicalConditions: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
