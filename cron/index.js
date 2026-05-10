const cron = require('node-cron');
const { runFullBackup } = require('./backup');
require('dotenv').config();

function registerCronJobs() {
  const schedule = process.env.BACKUP_SCHEDULE || '0 2 * * *';

  const isValid = cron.validate(schedule);
  if (!isValid) {
    console.error(`Invalid cron schedule: "${schedule}". Backups disabled.`);
    return;
  }

  cron.schedule(schedule, async () => {
    console.log(`[${new Date().toLocaleString()}] Starting scheduled backup...`);
    try {
      await runFullBackup();
      console.log(`[${new Date().toLocaleString()}] Scheduled backup completed.`);
    } catch (err) {
      console.error(`[${new Date().toLocaleString()}] Scheduled backup failed:`, err.message);
    }
  });

  console.log(`Cron backup registered with schedule: "${schedule}"`);
}

module.exports = registerCronJobs;
