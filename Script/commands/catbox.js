const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { downloadFile } = require("../../utils/index");
const path = require("path");

module.exports.config = {
 name: "catbox",
 version: "1.3.0",
 hasPermssion: 0,
 credits: "ULLASH",
 description: "Upload media to Catbox and save links per thread; also list links",
 commandCategory: "media",
 usages: "[reply to image/video/audio] | list",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 const { threadID, type, messageReply, messageID } = event;

 // ================= LIST COMMAND =================
 if (args[0] && args[0].toLowerCase() === "list") {
 const threadFolder = path.join(__dirname, "thread_links", threadID);
 const saveFilePath = path.join(threadFolder, "links.txt");

 if (!fs.existsSync(saveFilePath)) {
 return api.sendMessage("❐ No links found for this thread.", threadID, messageID);
 }

 const links = fs.readFileSync(saveFilePath, "utf-8").trim().split("\n");
 if (links.length === 0) {
 return api.sendMessage("❐ No links saved in this thread.", threadID, messageID);
 }

 let msg = "📄 Saved links for this thread:\n";
 links.forEach((link, i) => {
 msg += `${i + 1}. ${link}\n`;
 });

 return api.sendMessage(msg.trim(), threadID, messageID);
 }
 // ================================================

 // ================= UPLOAD COMMAND =================
 if (type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length === 0) {
 return api.sendMessage("❐ Please reply to a photo/video/audio file.", threadID, messageID);
 }

 const attachmentPaths = [];

 // ডাউনলোড ফাংশন
 async function getAttachments(attachments) {
 let index = 0;
 for (const data of attachments) {
 const ext = data.type === "photo" ? "jpg" :
 data.type === "video" ? "mp4" :
 data.type === "audio" ? "mp3" :
 data.type === "animated_image" ? "gif" : "dat";

 const filePath = __dirname + `/cache/${Date.now()}_${index}.${ext}`;
 await downloadFile(data.url, filePath);
 attachmentPaths.push(filePath);
 index++;
 }
 }

 await getAttachments(messageReply.attachments);

 let msg = "";

 // Thread অনুযায়ী folder
 const threadFolder = path.join(__dirname, "thread_links", threadID);
 if (!fs.existsSync(threadFolder)) fs.mkdirSync(threadFolder, { recursive: true });

 const saveFilePath = path.join(threadFolder, "links.txt");

 for (const filePath of attachmentPaths) {
 try {
 const form = new FormData();
 form.append("reqtype", "fileupload");
 form.append("fileToUpload", fs.createReadStream(filePath));

 const response = await axios.post("https://catbox.moe/user/api.php", form, {
 headers: form.getHeaders(),
 maxBodyLength: Infinity
 });

 const link = response.data.trim();
 msg += `${link}\n`;

 // লিঙ্ক save করা
 fs.appendFileSync(saveFilePath, link + "\n", "utf-8");
 } catch (err) {
 console.error("Catbox upload failed:", err);
 msg += "❌ Upload failed for one file.\n";
 } finally {
 if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
 }
 }

 return api.sendMessage(msg.trim(), threadID, messageID);
};