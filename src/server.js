require('dotenv').config();
const app = require('./app');
const { startReminderJob } = require('./jobs/reminderJob');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    message: `Server running on port ${PORT}`,
    environment: process.env.NODE_ENV,
  }));

  // Start cron job after server is up
  startReminderJob();
});