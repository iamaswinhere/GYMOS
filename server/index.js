const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

if (!process.env.MONGODB_URI) {
  console.error("CRITICAL ERROR: MONGODB_URI is not defined in Environment Variables!");
}

if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is missing! Falling back to generic secret for recovery.");
  process.env.JWT_SECRET = "GYMOS_DEFAULT_EMERGENCY_SECRET_123";
}

// Security Middleware
app.use(helmet());

// CORS Middleware (must be before rate limiter so preflight requests get CORS headers)
const corsEnv = process.env.CORS_ORIGIN || '*';
const allowedOrigins = corsEnv.split(',');
const isGlobalAllowed = allowedOrigins.includes('*');

app.use(cors({
  origin: function (origin, callback) {
    // ALWAYS allow for testing and seamless mobile app integration
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Rate Limiting (after CORS, skip preflight OPTIONS requests)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window (increased for bulk CSV operations)
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Don't count preflight requests
});
app.use('/api/', limiter);

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // ALWAYS allow for testing and seamless mobile app integration
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Pass io to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database Connection + Auto-seed admin
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    try {
      const Admin = require('./models/Admin');
      const existing = await Admin.findOne({ role: 'admin' });
      if (!existing) {
        const admin = new Admin({
          username: 'gymos_admin',
          password: 'GymOS@2024!',
          name: 'GYMOS Admin',
          role: 'admin'
        });
        await admin.save();
        console.log('✅ Admin auto-seeded: gymos_admin / GymOS@2024!');
      } else {
        console.log('Admin already exists in DB:', existing.username);
      }

      // Auto-seed default trainer
      const existingTrainer = await Admin.findOne({ role: 'trainer' });
      if (!existingTrainer) {
        const trainer = new Admin({
          username: 'gymos_trainer',
          password: 'Trainer@2024!',
          name: 'GYMOS Trainer',
          role: 'trainer'
        });
        await trainer.save();
        console.log('✅ Trainer auto-seeded: gymos_trainer / Trainer@2024!');
      } else {
        console.log('Trainer already exists in DB:', existingTrainer.username);
      }
    } catch (seedErr) {
      console.error('Admin seed failed:', seedErr.message);
    }
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/razorpay', require('./routes/razorpayRoutes'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('GYMOS API is running with WebSockets...');
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
