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

// ==== captions ====
const captions = {
 zihad: "👫 zihad album file 🥵"
};

// ==== admin IDs (multi-admin support) ====
const ADMIN_IDS = [
 "100068870361850",
 "100001088468923",
 "61572299956804"
];

module.exports.config = {
 name: "zihad",
 version: "1.1.0",
 hasPermssion: 2, // admin only
 credits: "Ullash",
 description: "Get video from zihad category (admin only)",
 usePrefix: true,
 prefix: true,
 category: "Media",
 commandCategory: "Media",
 usages: "/zihad",
 cooldowns: 5,
};

// ==== run function ====
module.exports.run = async function ({ api, event }) {
 const { threadID, messageID, senderID } = event;

 // admin check
 if (!ADMIN_IDS.includes(senderID)) {
 return api.sendMessage("🚫 You are not authorized to use this command.", threadID, messageID);
 }

 const category = "zihad";

 try {
 let usedLinks = loadUsedLinks();
 if (!usedLinks[category]) usedLinks[category] = [];

 let mediaUrl;
 let tries = 0;

 while (tries < 5) {
 const res = await axios.get(`${BASE_API_URL}/album?type=${category}`);
 const url = res.data.data;
 if (url && !usedLinks[category].includes(url)) {
 mediaUrl = url;
 break;
 }
 tries++;
 }

 // সব লিঙ্ক শেষ হলে রিসেট
 if (!mediaUrl) {
 usedLinks[category] = [];
 saveUsedLinks(usedLinks);

 const res2 = await axios.get(`${BASE_API_URL}/album?type=${category}`);
 mediaUrl = res2.data.data;
 }

 if (!mediaUrl) {
 return api.sendMessage("⚠️ zihad ক্যাটাগরিতে নতুন কিছু নেই। পরে চেষ্টা করুন।", threadID, messageID);
 }

 usedLinks[category].push(mediaUrl);
 saveUsedLinks(usedLinks);

 const response = await axios({ method: "get", url: mediaUrl, responseType: "stream" });
 const filename = path.basename(mediaUrl).split("?")[0];
 const filePath = path.join(cacheDir, `${Date.now()}_${filename}`);
 const writer = fs.createWriteStream(filePath);

 response.data.pipe(writer);
 writer.on("finish", () => {
 api.sendMessage({
 body: captions[category],
 attachment: fs.createReadStream(filePath)
 }, threadID, () => fs.unlinkSync(filePath), messageID);
 });
 writer.on("error", err => {
 console.error("Write Error:", err);
 api.sendMessage("❌ Failed to send video.", threadID, messageID);
 });

 } catch (err) {
 console.error("Axios Error:", err.message);
 return api.sendMessage("❌ Something went wrong. Try again!", threadID, messageID);
 }
};
