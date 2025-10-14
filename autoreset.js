const moment = require("moment-timezone");

const config = {
  adminIDs: ["100001088468923", "61572299956804"], // তোমার দেওয়া এডমিন আইডি
  timezone: "Asia/Dhaka"
};

let lastRestartHour = null;

console.log("✅ AutoReset System Started");

// প্রতি সেকেন্ডে চেক করবে
setInterval(() => {
  const now = moment.tz(config.timezone);
  const hour = now.format("HH");
  const minute = now.format("mm");
  const second = now.format("ss");

  if (minute === "00" && second === "00" && lastRestartHour !== hour) {
    lastRestartHour = hour;

    const formattedTime = now.format("HH:mm:ss");

    // এডমিনদের মেসেজ "সিমুলেট" করা হচ্ছে
    config.adminIDs.forEach(admin => {
      console.log(`⚡ System Notice to ${admin} ⚡\nCurrent Time: ${formattedTime}\nSystem is restarting...`);
    });

    // 2 সেকেন্ড পরে রিস্টার্ট
    setTimeout(() => {
      console.log("🔄 System restarting now...");
      process.exit(1);
    }, 2000);
  }
}, 1000);

// Optional: বর্তমানে সময় দেখার কমান্ড
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.on("line", (input) => {
  if (input.trim() === "time") {
    console.log("Current Time:", moment.tz(config.timezone).format("HH:mm:ss"));
  }
});