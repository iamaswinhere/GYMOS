const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');
dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await Admin.findOne({ role: 'admin' });
  if (!existing) {
    const admin = new Admin({
      username: 'admin',
      password: 'password123',
      name: 'GYMOS Admin',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin seeded: admin / password123');
  } else {
    console.log('Admin already exists');
  }
  process.exit();
}
seed();
