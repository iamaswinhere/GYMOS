const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Get current admin settings
router.get('/settings', async (req, res) => {
  try {
    const admin = await Admin.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin settings
router.put('/settings', async (req, res) => {
  try {
    const admin = await Admin.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    admin.settings = { ...admin.settings, ...req.body };
    await admin.save();
    res.json(admin.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
