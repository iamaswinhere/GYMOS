const Attendance = require('../models/Attendance');

// @desc    Check-in member
// @route   POST /api/attendance/checkin
// @access  Private
const checkin = async (req, res, next) => {
    try {
        const { memberId, method } = req.body;
        
        const attendance = await Attendance.create({
            gymId: req.gym._id,
            memberId,
            method,
        });

        res.status(201).json(attendance);
    } catch (error) {
        next(error);
    }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ gymId: req.gym._id }).populate('memberId');
        res.json(attendance);
    } catch (error) {
        next(error);
    }
};

module.exports = { checkin, getAttendance };
