const jwt = require('jsonwebtoken');
const Gym = require('../models/Gym');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new gym
// @route   POST /api/auth/registerGym
// @access  Public
const registerGym = async (req, res, next) => {
    try {
        const { gymName, ownerName, email, phone, password } = req.body;

        const gymExists = await Gym.findOne({ email });

        if (gymExists) {
            return res.status(400).json({ message: 'Gym already exists' });
        }

        const gym = await Gym.create({
            gymName,
            ownerName,
            email,
            phone,
            password,
        });

        if (gym) {
            res.status(201).json({
                _id: gym._id,
                gymName: gym.gymName,
                email: gym.email,
                token: generateToken(gym._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid gym data' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate a gym & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const gym = await Gym.findOne({ email }).select('+password');

        if (gym && (await gym.matchPassword(password))) {
            res.json({
                _id: gym._id,
                gymName: gym.gymName,
                email: gym.email,
                token: generateToken(gym._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { registerGym, login };
