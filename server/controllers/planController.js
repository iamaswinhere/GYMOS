const MembershipPlan = require('../models/MembershipPlan');

// @desc    Get all plans
// @route   GET /api/plans
// @access  Private
const getPlans = async (req, res, next) => {
    try {
        const plans = await MembershipPlan.find({ gymId: req.gym._id });
        res.json(plans);
    } catch (error) {
        next(error);
    }
};

// @desc    Add new plan
// @route   POST /api/plans
// @access  Private
const addPlan = async (req, res, next) => {
    try {
        const { planName, price, durationDays } = req.body;
        
        const plan = await MembershipPlan.create({
            gymId: req.gym._id,
            planName,
            price,
            durationDays,
        });

        res.status(201).json(plan);
    } catch (error) {
        next(error);
    }
};

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private
const updatePlan = async (req, res, next) => {
    try {
        const plan = await MembershipPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.gymId.toString() !== req.gym._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedPlan = await MembershipPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedPlan);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private
const deletePlan = async (req, res, next) => {
    try {
        const plan = await MembershipPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (plan.gymId.toString() !== req.gym._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await plan.deleteOne();

        res.json({ message: 'Plan removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPlans, addPlan, updatePlan, deletePlan };
