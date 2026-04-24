const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth, adminOnly, adminOrTrainer } = require('../middleware/auth');

// Create event (Admin or Trainer)
router.post('/add', auth, adminOrTrainer, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    
    // Notify all clients in real-time
    req.io.emit('eventUpdate', { type: 'added', event: savedEvent });
    
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all events (Auth Only)
router.get('/all', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete event (Admin or Trainer)
router.delete('/delete/:id', auth, adminOrTrainer, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    
    // Notify all clients in real-time
    req.io.emit('eventUpdate', { type: 'deleted', id: req.params.id });
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
