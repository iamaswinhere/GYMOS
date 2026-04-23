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
    const members = await Member.find({});
    let memberUpdates = 0;
    for (let m of members) {
      let base = 1000;
      let p = m.membershipPlan?.name || '';
      if (p.includes('Student')) base = 800;
      else if (p.includes('Quarterly')) base = 2500;
      else if (p.includes('Half-Yearly')) base = 5000;
      else if (p.includes('Yearly')) base = 10000;
      
      if (p.includes('+ PT')) base += 2000;
      
      m.membershipPlan.price = base;
      await m.save();
      memberUpdates++;
    }
    console.log(`Updated ${memberUpdates} members.`);

    console.log('Updating Payments...');
    const payments = await Payment.find({});
    let paymentUpdates = 0;
    for (let py of payments) {
      let base = 1000;
      let p = py.plan || '';
      if (p.includes('Student')) base = 800;
      else if (p.includes('Quarterly')) base = 2500;
      else if (p.includes('Half-Yearly')) base = 5000;
      else if (p.includes('Yearly')) base = 10000;
      
      if (p.includes('+ PT')) base += 2000;
      
      py.amount = base;
      await py.save();
      paymentUpdates++;
    }
    console.log(`Updated ${paymentUpdates} payments.`);

    console.log('Done!');
  } catch (error) {
    console.error('Error updating DB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB.');
  }
}

updateDb();
