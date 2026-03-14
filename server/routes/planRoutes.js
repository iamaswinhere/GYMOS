const express = require('express');
const router = express.Router();
const {
    getPlans,
    addPlan,
    updatePlan,
    deletePlan,
} = require('../controllers/planController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getPlans).post(addPlan);
router.route('/:id').put(updatePlan).delete(deletePlan);

module.exports = router;
