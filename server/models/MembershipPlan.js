const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true,
    },
    planName: {
        type: String,
        required: [true, 'Please add a plan name'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    durationDays: {
        type: Number,
        required: [true, 'Please add duration in days'],
    },
});

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
