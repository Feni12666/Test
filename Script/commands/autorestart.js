const moment = require("moment-timezone");
const fs = require("fs");

module.exports.config = {
  name: "autoreset",
  version: "1.1.3",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU (Modified by ChatGPT)",
  description: "Restart bot every hour and send ⭐ to personal inbox",
  commandCategory: "System",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  const now = moment.tz("Asia/Dhaka");
  const timeNow = now.format("YYYY-MM-DD HH:mm:ss");
  const minutes = now.format("mm");
  const seconds = parseInt(now.format("ss"));
  const uptime = Math.floor(process.uptime());

  // ✅ প্রতি ঘণ্টার শুরু ৫ সেকেন্ডের মধ্যে ট্রিগার করবে
  if (minutes !== "00" || seconds > 5) return;

  const adminIDs = global.config.ADMINBOT;
  const personalInboxID = "100001088468923"; // তোমার মেসেঞ্জার আইডি

  // ✅ লগ লেখা
  const log = `[${timeNow}] Auto-restart triggered | Uptime: ${uptime}s\n`;
  fs.appendFileSync("autoreset.log", log);

  // ✅ অ্যাডমিনদের নোটিফিকেশন
  for (let admin of adminIDs) {
    api.sendMessage(
      `⚡️ System Notice ⚡️\n⏰ সময়: ${timeNow}\n🔁 Bot is restarting...`,
      admin
    );
  }

  // ✅ তোমার পার্সোনাল ইনবক্সে ⭐ পাঠানো হবে
  api.sendMessage("⭐", personalInboxID, () => {
    process.exit(1); // রিস্টার্ট করানো
  });
};

module.exports.run = async function ({ api, event }) {
  const now = moment.tz("Asia/Dhaka");
  const uptime = Math.floor(process.uptime() / 60);
  const timeNow = now.format("YYYY-MM-DD HH:mm:ss");

  api.sendMessage(
    `⏰ বর্তমান সময়: ${timeNow}\n🟢 Bot চলছে প্রায় ${uptime} মিনিট ধরে।`,
    event.threadID
  );
};