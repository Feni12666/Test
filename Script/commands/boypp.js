const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "boy pp",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐒𝐀𝐇𝐔",
  description: "Send random Facebook boy profile pictures with stylish captions",
  commandCategory: "Random-IMG",
  usages: "boy pp",
  cooldowns: 2,
  dependencies: {
    "request": "",
    "fs-extra": ""
  }
};

// Keep track of already sent images
let sentImages = [];

module.exports.run = async ({ api, event }) => {
  const imgLinks = [
    "https://i.imgur.com/yCN9Piq.jpeg",
    "https://i.imgur.com/IpA5QUo.jpeg",
    "https://i.imgur.com/Sgz38xm.jpeg",
    "https://i.imgur.com/UZ7CiLk.jpeg",
    "https://i.imgur.com/jqZZm1C.jpeg",
    "https://i.imgur.com/stP854Y.jpeg",
    "https://i.imgur.com/pXzuhBu.jpeg",
    "https://i.imgur.com/iCboC1U.jpeg",
    "https://i.imgur.com/mh8RO7i.jpeg",
    "https://i.imgur.com/peKWGdr.jpeg",
    "https://i.imgur.com/YekeWRX.jpeg",
    "https://i.imgur.com/ktWIKXB.jpeg",
    "https://i.imgur.com/xoNjVNn.jpeg",
    "https://i.imgur.com/KLmB1w6.jpeg",
    "https://i.imgur.com/7tgT5rC.jpeg",
    "https://i.imgur.com/q0mTaXT.jpeg",
    "https://i.imgur.com/c832Y6X.jpeg",
    "https://i.imgur.com/xWiRrNz.jpeg",
    "https://i.imgur.com/e9tFkoc.jpeg",
    "https://i.imgur.com/0LNdctf.jpeg",
    "https://i.imgur.com/DfabYU0.jpeg",
    "https://i.imgur.com/d8E4g8n.png",
    "https://i.imgur.com/Ak3yB2r.jpeg",
    "https://i.imgur.com/Bm2zYuu.jpeg",
    "https://i.imgur.com/GQNt5Dm.jpeg",
    "https://i.imgur.com/VseMop0.jpeg",
    "https://i.imgur.com/pq7xQQz.jpeg",
    "https://i.imgur.com/e8y24F0.jpeg"
  ];

  // Reset sentImages if all have been sent
  if (sentImages.length >= imgLinks.length) sentImages = [];

  // Filter unused images
  const unusedImages = imgLinks.filter(img => !sentImages.includes(img));
  const selectedImage = unusedImages[Math.floor(Math.random() * unusedImages.length)];
  sentImages.push(selectedImage);

  const captions = [
    "🔥 Feeling awesome today! 🤌",
    "💫 Swipe to see the vibes! 😎",
    "🫦 Handsome alert! ❤️‍🔥",
    "🌟 Shine bright like a star! ✨",
    "🥵 Mood: Unstoppable 💯",
    "👑 King energy activated! 👌",
    "💥 Confidence level: MAX 💫",
    "😎 Stylish & classy 🤵",
    "🔥 Boys just wanna have fun 😏",
    "💖 Keep smiling, stay positive 🌈"
  ];

  const selectedCaption = captions[Math.floor(Math.random() * captions.length)];
  const filePath = `${__dirname}/cache/fb_boy_${Date.now()}.jpg`;

  const callback = () => {
    api.sendMessage({
      body: `✨━━━━━━━━━━━━━━━━━✨\n${selectedCaption}\n\n👑 Credit: 𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐒𝐀𝐇𝐔\n✨━━━━━━━━━━━━━━━━━✨`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath));
  };

  request(encodeURI(selectedImage)).pipe(fs.createWriteStream(filePath)).on("close", callback);
};