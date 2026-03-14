const express = require('express');
const router = express.Router();
const { checkin, getAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/checkin', checkin);
router.get('/', getAttendance);

module.exports = router;
