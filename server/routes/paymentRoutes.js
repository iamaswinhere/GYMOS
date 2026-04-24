const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { auth, adminOnly, adminOrTrainer } = require('../middleware/auth');

// Get all payments (Admin or Trainer)
router.get('/all', auth, adminOrTrainer, async (req, res) => {
  try {
    const payments = await Payment.find().populate('memberId').sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add payment (Admin Only)
router.post('/add', auth, adminOnly, async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get member specific payments (Admin or The Member)
router.get('/member/:id', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ memberId: req.params.id }).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get income report (Dashboard) (Admin Only)
router.get('/income-report', auth, adminOnly, async (req, res) => {
  try {
    const totalIncome = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const monthlyIncome = await Payment.aggregate([
      {
        $group: {
          _id: { $month: "$paymentDate" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      total: totalIncome.length > 0 ? totalIncome[0].total : 0,
      monthly: monthlyIncome
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
