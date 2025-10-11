module.exports.config = {
  name: "autoreset",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Automatically restart the system every hour",
  commandCategory: "System",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
  const seconds = moment.tz("Asia/Dhaka").format("ss");
  const adminIDs = global.config.ADMINBOT;

  console.log(timeNow);

  const restartTimes = [
    `01:00:${seconds}`,
    `02:00:${seconds}`,
    `03:00:${seconds}`,
    `04:00:${seconds}`,
    `05:00:${seconds}`,
    `06:00:${seconds}`,
    `07:00:${seconds}`,
    `08:00:${seconds}`,
    `09:00:${seconds}`,
    `10:00:${seconds}`,
    `11:00:${seconds}`,
    `12:00:${seconds}`
  ];

  if (restartTimes.includes(timeNow) && seconds < 6) {
    for (let admin of adminIDs) {
      setTimeout(() => {
        api.sendMessage(
          `⚡ System Notice ⚡\nCurrent Time: ${timeNow}\nSystem is restarting...`,
          admin,
          () => process.exit(1)
        );
      }, 1000);
    }
  }
};

module.exports.run = async function ({ api, event }) {
  const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Dhaka").format("HH:mm:ss");
  api.sendMessage(`Current Time: ${timeNow}`, event.threadID);
};