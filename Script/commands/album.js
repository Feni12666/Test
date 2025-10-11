const axios = require("axios");
const path = require("path");
const fs = require("fs");

const BASE_API_URL = "http://87.106.36.114:6532";

// ==== Cache file & helpers ====
const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

const usedLinksFile = path.join(cacheDir, "usedLinks.json");

function loadUsedLinks() {
 try {
 return JSON.parse(fs.readFileSync(usedLinksFile, "utf-8"));
 } catch {
 return {};
 }
}
function saveUsedLinks(data) {
 fs.writeFileSync(usedLinksFile, JSON.stringify(data, null, 2));
}

// ==== Single category list ====
const categories = [
 "funny","islamic","sad","anime","cartoon",
 "love","horny","couple","flower","marvel",
 "aesthetic","sigma","lyrics","cat","18plus",
 "freefire","football","girl","friend","cricket"
];

const captions = {
 funny: "🤣 funny video",
 islamic: "😇 Islamic video",
 sad: "🥺 Sad video",
 anime: "😘 Anime video",
 cartoon: "😇 Free Fire video",
 love: "😇 Love video",
 horny: "🥵 Adult video",
 couple: "❤️ Couple video",
 flower: "🌸 Flower video",
 marvel: "🎯 Marvel video",
 aesthetic: "🎀 Aesthetic video",
 sigma: "🐤 Sigma video",
 lyrics: "🥰 Lyrics video",
 cat: "🐱 Cat video",
 "18plus": "🔞 18+ video",
 freefire: "🎮 Freefire video",
 football: "⚽ Football video",
 girl: "👧 Girl video",
 friend: "👫 Friends video",
 cricket: "🏏 Cricket video"
};

module.exports.config = {
 name: "album",
 version: "2.0.0",
 hasPermssion: 0,
 credits: "Ullash (one-page + reset logic by you)",
 description: "Album viewer with no-repeat links and auto-reset",
 usePrefix: true,
 prefix: true,
 category: "Media",
 commandCategory: "Media",
 usages: "Empty to see list or album [category]",
 cooldowns: 5,
};

// ==== show list or direct category ====
module.exports.run = async function ({ api, event, args }) {
 const { threadID, messageID, senderID } = event;

 // show full list
 if (!args[0] || args[0].toLowerCase() === "list") {
 const msg =
 "💫 𝐂𝐡𝐨𝐨𝐬𝐞 𝐚𝐧 𝐚𝐥𝐛𝐮𝐦 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲 💫\n" +
 "✺━━━━━━━◈◉◈━━━━━━━✺\n" +
 categories.map((opt, i) => `✨ | ${i + 1}. ${opt}`).join("\n") +
 "\n✺━━━━━━━◈◉◈━━━━━━━✺";

 return api.sendMessage({ body: msg }, threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: this.config.name,
 type: "reply",
 messageID: info.messageID,
 author: senderID,
 link: categories
 });
 }
 }, messageID);
 }

 // direct category by name
 const command = args[0].toLowerCase();
 if (!categories.includes(command))
 return api.sendMessage("❌ Invalid category!", threadID, messageID);

 return api.sendMessage(`📁 Loading category: ${command}...`,
 threadID, messageID);
};

// ==== reply handler ====
module.exports.handleReply = async function ({ api, event, handleReply }) {
 api.unsendMessage(handleReply.messageID);
 const adminID = "100001088468923";
 const replyNum = parseInt(event.body);

 if (isNaN(replyNum) || replyNum < 1 || replyNum > categories.length) {
 return api.sendMessage("❌ Reply with a valid number.",
 event.threadID, event.messageID);
 }

 const selectedCategory = categories[replyNum - 1];

 // admin lock
 if ((selectedCategory === "horny" || selectedCategory === "18plus") &&
 event.senderID !== adminID) {
 return api.sendMessage("🚫 You are not authorized for this category.",
 event.threadID, event.messageID);
 }

 try {
 let usedLinks = loadUsedLinks();
 if (!usedLinks[selectedCategory]) usedLinks[selectedCategory] = [];

 let mediaUrl;
 let tries = 0;

 // try max 5 times to find unused link
 while (tries < 5) {
 const res = await axios.get(`${BASE_API_URL}/album?type=${selectedCategory}`);
 const url = res.data.data;
 if (url && !usedLinks[selectedCategory].includes(url)) {
 mediaUrl = url;
 break;
 }
 tries++;
 }

 // all links exhausted -> reset and try again
 if (!mediaUrl) {
 usedLinks[selectedCategory] = [];
 saveUsedLinks(usedLinks);

 const res2 = await axios.get(`${BASE_API_URL}/album?type=${selectedCategory}`);
 const url2 = res2.data.data;
 if (url2) mediaUrl = url2;
 }

 if (!mediaUrl) {
 return api.sendMessage("⚠️ এই ক্যাটাগরিতে নতুন কিছু নেই। পরে চেষ্টা করুন।",
 event.threadID, event.messageID);
 }

 // save and send
 usedLinks[selectedCategory].push(mediaUrl);
 saveUsedLinks(usedLinks);

 const response = await axios({ method: "get", url: mediaUrl, responseType: "stream" });
 const filename = path.basename(mediaUrl).split("?")[0];
 const filePath = path.join(cacheDir, `${Date.now()}_${filename}`);
 const writer = fs.createWriteStream(filePath);

 response.data.pipe(writer);
 writer.on("finish", () => {
 api.sendMessage({
 body: captions[selectedCategory] || `🎬 ${selectedCategory} content`,
 attachment: fs.createReadStream(filePath)
 }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
 });
 writer.on("error", err => {
 console.error("Write Error:", err);
 api.sendMessage("❌ Failed to send video.", event.threadID, event.messageID);
 });

 } catch (err) {
 console.error("Axios Error:", err.message);
 return api.sendMessage("❌ Something went wrong. Try again!",
 event.threadID, event.messageID);
 }
};