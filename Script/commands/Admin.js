const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "admin",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭",
  description: "Show Admin Info with Language Option",
  commandCategory: "info",
  usages: "[en/bn]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");
  const lang = args[0] && args[0].toLowerCase() === "bn" ? "bn" : "en";

  let message;
  if(lang === "bn") {
    message = `
🌟━━━━━━━━━━━━━━━━🌟
👑 এডমিন তথ্য 👑
🌟━━━━━━━━━━━━━━━━🌟

🧑 নাম        : 𝐒𝐇𝐀𝐇𝐀𝐃𝐀𝐓
🚹 লিঙ্গ       : পুরুষ
❤️ সম্পর্ক     : একক
🎂 বয়স        : ২৫
🕌 ধর্ম        : ইসলাম
🏫 শিক্ষা      : কৃষিতে ডিপ্লোমা
🏡 ঠিকানা     : ফেনী

🎵 TikTok      : shahadat.0071
🌐 Facebook    : https://www.facebook.com/100001088468923

🕒 সময়        : ${time}
🌟━━━━━━━━━━━━━━━━🌟
`;
  } else {
    message = `
🌟━━━━━━━━━━━━━━━━🌟
👑 ADMIN DETAILS 👑
🌟━━━━━━━━━━━━━━━━🌟

🧑 Name      : 𝐒𝐇𝐀𝐇𝐀𝐃𝐀𝐓
🚹 Gender    : Male
❤️ Relationship : Single
🎂 Age       : 25
🕌 Religion  : Islam
🏫 Education : Diploma in Agriculture
🏡 Address   : Feni

🎵 TikTok    : shahadat.0071
🌐 Facebook  : https://www.facebook.com/100001088468923

🕒 Updated Time : ${time}
🌟━━━━━━━━━━━━━━━━🌟
`;
  }

  var callback = () => api.sendMessage({
    body: message,
    attachment: fs.createReadStream(__dirname + "/cache/1.png")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));

  return request(encodeURI(`https://graph.facebook.com/61572299956804/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
    .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
    .on('close', () => callback());
};