const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');
const { auth } = require('../middleware/auth');

// Helper to generate the current hour's secure token
const getExpectedToken = () => {
    const now = new Date();
    // Match the frontend's token generation: YYYY-MM-DD-HH
    const dateString = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
    return Buffer.from(`gymos_secure_${dateString}`).toString('base64');
};

// Mark attendance
router.post('/mark', auth, async (req, res) => {
  try {
    const { memberId, token } = req.body;
    
    // Security: A member can only mark attendance for themselves unless they are an admin
    if (req.userRole !== 'admin' && req.user !== memberId) {
      return res.status(403).json({ message: 'Unauthorized: You can only mark attendance for yourself' });
    }

    // Kiosk Security: If not an admin, a valid QR scan token is required
    if (req.userRole !== 'admin') {
      const expectedToken = getExpectedToken();
      if (token !== expectedToken) {
          return res.status(403).json({ message: 'Invalid or expired check-in QR code.' });
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

    // Check if already marked present today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      memberId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const newAttendance = new Attendance({ memberId });
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

module.exports = router;
