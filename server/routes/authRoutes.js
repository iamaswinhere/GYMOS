const express = require('express');
const router = express.Router();
const { registerGym, login } = require('../controllers/authController');

router.post('/registerGym', registerGym);
router.post('/login', login);

module.exports = router;
