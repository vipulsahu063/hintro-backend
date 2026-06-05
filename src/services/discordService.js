const axios = require('axios');

const sendDiscordReminder = async (actionItem) => {
  const message = {
    embeds: [
      {
        title: '⏰ Overdue Action Item Reminder',
        color: 0xff0000,
        fields: [
          { name: 'Task', value: actionItem.task, inline: false },
          { name: 'Assigned To', value: actionItem.assignee, inline: true },
          {
            name: 'Due Date',
            value: actionItem.dueDate
              ? new Date(actionItem.dueDate).toLocaleDateString()
              : 'No due date set',
            inline: true,
          },
          { name: 'Status', value: actionItem.status, inline: true },
        ],
        footer: { text: 'Hintro Meeting Intelligence' },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  await axios.post(process.env.DISCORD_WEBHOOK_URL, message);
  return true;
};

module.exports = { sendDiscordReminder };