const cron = require('node-cron');
const Member = require('./models/Member');

const initCronJobs = (io) => {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] Running daily expiry check...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrowStart = new Date(today);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      
      const tomorrowEnd = new Date(tomorrowStart);
      tomorrowEnd.setHours(23, 59, 59, 999);

      const expiringMembers = await Member.find({
        expiryDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
        membershipStatus: 'active'
      });

      console.log(`[CRON] Found ${expiringMembers.length} members expiring tomorrow.`);

      expiringMembers.forEach(member => {
        // Emit expiry warning to specific member room
        io.to(`member_${member._id}`).emit('expiryWarning', {
          message: 'Your membership expires tomorrow. Please renew to avoid interruption!'
        });
      });
    } catch (error) {
      console.error('[CRON] Error during daily expiry check:', error);
    }
  });
};

module.exports = { initCronJobs };
