const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
    },
    membershipPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MembershipPlan',
        required: true,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active',
    },
});

module.exports = mongoose.model('Member', memberSchema);
