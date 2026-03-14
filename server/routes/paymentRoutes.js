const express = require('express');
const router = express.Router();
const { getPayments, addPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getPayments).post(addPayment);

module.exports = router;
