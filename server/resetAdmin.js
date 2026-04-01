const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');
dotenv.config();

// ========================================
// SET YOUR NEW CREDENTIALS HERE
// ========================================
const NEW_USERNAME = 'gymos_admin';
const NEW_PASSWORD = 'GymOS@2024!';
// ========================================

async function resetAdmin() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  // Delete ALL existing admin records
  const deleted = await Admin.deleteMany({ role: 'admin' });
  console.log(`Deleted ${deleted.deletedCount} existing admin record(s).`);

  // Create fresh admin
  const admin = new Admin({
    username: NEW_USERNAME,
    password: NEW_PASSWORD, // Will be hashed by the model's pre-save hook
    name: 'GYMOS Admin',
    role: 'admin'
  });

  await admin.save();
  console.log(`\n✅ Admin reset successfully!`);
  console.log(`   Username: ${NEW_USERNAME}`);
  console.log(`   Password: ${NEW_PASSWORD}`);
  console.log('\nYou can now log in with these credentials.');
  process.exit(0);
}

resetAdmin().catch(err => {
  console.error('❌ Reset failed:', err.message);
  process.exit(1);
});
