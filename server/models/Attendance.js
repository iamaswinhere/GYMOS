const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['present'],
    default: 'present'
  }
}, { timestamps: true });

// Ensure a member can only be marked present once per day
attendanceSchema.index({ memberId: 1, date: 1 }, { unique: false });

module.exports = mongoose.model('Attendance', attendanceSchema);
