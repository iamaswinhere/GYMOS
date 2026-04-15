const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { auth, adminOnly } = require('../middleware/auth');

// Get all payments (Admin Only)
router.get('/all', auth, adminOnly, async (req, res) => {
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

// Verify a pending payment (Admin Only)
router.patch('/verify/:id', auth, adminOnly, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    
    payment.status = 'success';
    await payment.save();
    
    res.json({ message: 'Payment verified successfully', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject a pending payment (Admin Only)
router.delete('/reject/:id', auth, adminOnly, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    
    // Note: In a real system, we might want to "revert" the expiry change on the member as well.
    // For now, we simply delete the fraudulent payment record.
    await Payment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Payment rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
