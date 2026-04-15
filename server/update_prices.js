require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const Payment = require('./models/Payment');

async function updateDb() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Updating Members...');
    const memberUpdate = await Member.updateMany(
      {},
      { $set: { 'membershipPlan.price': 1 } }
    );
    console.log(`Updated ${memberUpdate.modifiedCount} members.`);

    console.log('Updating Payments...');
    const paymentUpdate = await Payment.updateMany(
      {},
      { $set: { amount: 1 } }
    );
    console.log(`Updated ${paymentUpdate.modifiedCount} payments.`);

    console.log('Done!');
  } catch (error) {
    console.error('Error updating DB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB.');
  }
}

updateDb();
