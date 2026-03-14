const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true,
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    checkInTime: {
        type: String,
        default: () => new Date().toLocaleTimeString(),
    },
    date: {
        type: Date,
        default: Date.now,
    },
    method: {
        type: String,
        enum: ['qr', 'manual'],
        default: 'manual',
    },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
