const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Create a new lead from landing page
router.post('/add', async (req, res) => {
  try {
    const { name, phone, plan, hasPT } = req.body;
    
    if (!name || !phone || !plan) {
      return res.status(400).json({ message: 'Name, phone, and plan are required' });
    }

    const newLead = new Lead({
      name,
      phone,
      plan,
      hasPT: !!hasPT
    });

    const savedLead = await newLead.save();

    // Notify Admin Dashboard via Socket.io
    if (req.io) {
      req.io.emit('leadUpdate', {
        type: 'new_lead',
        lead: savedLead
      });
    }

    res.status(201).json(savedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all leads (for admin panel if needed later)
router.get('/all', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
