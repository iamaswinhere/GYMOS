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

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Middleware
const corsEnv = process.env.CORS_ORIGIN || '*';
const allowedOrigins = corsEnv.split(',');
const isGlobalAllowed = allowedOrigins.includes('*');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || isGlobalAllowed || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Return false to block, but don't pass an Error which causes a 500
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || isGlobalAllowed || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
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
