const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({ gymId: req.gym._id })
            .populate('memberId')
            .populate('planId');
        res.json(payments);
    } catch (error) {
        next(error);
    }
};

// @desc    Add new payment
// @route   POST /api/payments
// @access  Private
const addPayment = async (req, res, next) => {
    try {
        const { memberId, planId, amount, paymentMethod } = req.body;
        
        const payment = await Payment.create({
            gymId: req.gym._id,
            memberId,
            planId,
            amount,
            paymentMethod,
        });

        res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};

module.exports = { getPayments, addPayment };
