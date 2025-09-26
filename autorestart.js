// autoRestart.js
// প্রতি ২ ঘন্টা পর বট নিজে থেকে রিস্টার্ট করবে

const { spawn } = require("child_process");

function startBot() {
  // আপনার মূল বট ফাইলের নাম যদি mirai.js না হয়, এখানে ঠিক করে দিন
  const bot = spawn("node", ["mirai.js"], { stdio: "inherit" });

  // বট বন্ধ হলে ৫ সেকেন্ড পরে আবার চালু হবে
  bot.on("close", (code) => {
    console.log(`Bot exited with code ${code}. Restarting in 5s...`);
    setTimeout(startBot, 5000);
  });

  // ⏱️ প্রতি ২ ঘন্টা পর স্বয়ংক্রিয় রিস্টার্ট
  setInterval(() => {
    console.log("⏳ 2 hours passed — restarting bot...");
    bot.kill(); // kill হলে উপরকার on("close") ট্রিগার হয়ে আবার চালু হবে
  }, 2 * 60 * 60 * 1000); // 2 ঘন্টা = 7,200,000 ms
}

// স্ক্রিপ্ট শুরু
startBot();