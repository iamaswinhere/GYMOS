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
      { id: admin._id, role: admin.role },
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

// Update admin credentials
router.put('/credentials', auth, adminOnly, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    
    // req.user has the admin ID from auth middleware
    const admin = await Admin.findById(req.user);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }
    
    if (newUsername) admin.username = newUsername;
    if (newPassword) admin.password = newPassword;
    
    await admin.save();
    
    res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
