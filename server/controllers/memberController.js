const Member = require('../models/Member');

// @desc    Get all members
// @route   GET /api/members
// @access  Private
const getMembers = async (req, res, next) => {
    try {
        const members = await Member.find({ gymId: req.gym._id }).populate('membershipPlanId');
        res.json(members);
    } catch (error) {
        next(error);
    }
};

// @desc    Add new member
// @route   POST /api/members
// @access  Private
const addMember = async (req, res, next) => {
    try {
        const { name, phone, membershipPlanId, expiryDate } = req.body;
        
        const member = await Member.create({
            gymId: req.gym._id,
            name,
            phone,
            membershipPlanId,
            expiryDate,
        });

        res.status(201).json(member);
    } catch (error) {
        next(error);
    }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
const updateMember = async (req, res, next) => {
    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Make sure member belongs to gym
        if (member.gymId.toString() !== req.gym._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedMember);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
const deleteMember = async (req, res, next) => {
    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Make sure member belongs to gym
        if (member.gymId.toString() !== req.gym._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await member.deleteOne();

        res.json({ message: 'Member removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMembers, addMember, updateMember, deleteMember };
