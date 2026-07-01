const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');
const { auth } = require('../middleware/auth');

// Static tokens — must match the Kiosk page constants exactly
const STATIC_QR_TOKEN = 'Z3ltb3Nfc3RhdGljX3FyX2NoZWNraW5fdG9rZW5fdjE=';
const STATIC_PIN = '839214';

// Mark attendance
router.post('/mark', auth, async (req, res) => {
  try {
    const { memberId, token, date } = req.body;
    
    // Security: A member can only mark attendance for themselves unless they are an admin or trainer
    if (req.userRole !== 'admin' && req.userRole !== 'trainer' && req.user !== memberId) {
      return res.status(403).json({ message: 'Unauthorized: You can only mark attendance for yourself' });
    }

    // Kiosk Security: Validate static QR token or static PIN
    if (req.userRole !== 'admin' && req.userRole !== 'trainer') {
      if (token !== STATIC_QR_TOKEN && token !== STATIC_PIN) {
          return res.status(403).json({ message: 'Invalid check-in token. Please scan the official GYMOS Kiosk QR.' });
      }
    }

    // Check if member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if membership is active
    if (member.membershipStatus !== 'active' || new Date(member.expiryDate) < new Date()) {
       return res.status(403).json({ message: 'Membership is expired or inactive' });
    }

    // Check if already marked present for the given date (default to today)
    let targetDate = new Date();
    if (date && (req.userRole === 'admin' || req.userRole === 'trainer')) {
      targetDate = new Date(date);
    }
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      memberId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const newAttendance = new Attendance({ 
      memberId,
      ...(date && (req.userRole === 'admin' || req.userRole === 'trainer') && { date: targetDate })
    });
    await newAttendance.save();

    // Emit real-time attendance event to admin portal
    req.io.emit('attendanceUpdate', { 
      memberId, 
      memberName: member.name,
      checkInTime: newAttendance.date 
    });

    res.status(201).json({ message: 'Attendance marked successfully', attendance: newAttendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance records
router.get('/', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'trainer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { date, memberId } = req.query;
    let query = {};

    if (date) {
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (memberId) {
      query.memberId = memberId;
    }

    const attendanceRecords = await Attendance.find(query).populate('memberId', 'name photoUrl mobileNumber membershipStatus');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an attendance record (unmark)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin' && req.userRole !== 'trainer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
