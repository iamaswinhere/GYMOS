const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { auth, adminOnly } = require('../middleware/auth');

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current admin settings
router.get('/settings', auth, adminOnly, async (req, res) => {
  try {
    const admin = await Admin.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin settings
router.put('/settings', auth, adminOnly, async (req, res) => {
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
