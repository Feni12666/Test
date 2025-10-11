const axios = require("axios");
const simsim = "https://simsimi.cyberbot.top";

module.exports.config = {
 name: "baby",
 version: "1.0.3",
 hasPermssion: 0,
 credits: "ULLASH",
 description: "Cute AI Baby Chatbot | Talk, Teach & Chat with Emotion ☢️",
 commandCategory: "simsim",
 usages: "[message/query]",
 cooldowns: 0,
 prefix: false
};

module.exports.run = async function ({ api, event, args, Users }) {
 try {
 const uid = event.senderID;
 const senderName = await Users.getNameUser(uid);
 const rawQuery = args.join(" "); 
 const query = rawQuery.toLowerCase(); 

 if (!query) {
 const ran = ["Bolo baby", "hum"];
 const r = ran[Math.floor(Math.random() * ran.length)];
 return api.sendMessage(r, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 });
 }

 const command = args[0].toLowerCase();
 
 if (["remove", "rm"].includes(command)) {
 const parts = rawQuery.replace(/^(remove|rm)\s*/i, "").split(" - ");
 if (parts.length < 2)
 return api.sendMessage(" | Use: remove [Question] - [Reply]", event.threadID, event.messageID);
 const [ask, ans] = parts.map(p => p.trim());
 const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
 return api.sendMessage(res.data.message, event.threadID, event.messageID);
 }

 if (command === "list") {
 const res = await axios.get(`${simsim}/list`);
 if (res.data.code === 200) {
 return api.sendMessage(
 `♾ Total Questions Learned: ${res.data.totalQuestions}\n★ Total Replies Stored: ${res.data.totalReplies}\n☠︎︎ Developer: ${res.data.author}`,
 event.threadID, event.messageID
 );
 } else {
 return api.sendMessage(`Error: ${res.data.message || "Failed to fetch list"}`, event.threadID, event.messageID);
 }
 }

 if (command === "edit") {
 const parts = rawQuery.replace(/^edit\s*/i, "").split(" - ");
 if (parts.length < 3)
 return api.sendMessage(" | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);
 const [ask, oldReply, newReply] = parts.map(p => p.trim());
 const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);
 return api.sendMessage(res.data.message, event.threadID, event.messageID);
 }

 if (command === "teach") {
 const parts = rawQuery.replace(/^teach\s*/i, "").split(" - ");
 if (parts.length < 2)
 return api.sendMessage(" | Use: teach [Question] - [Reply]", event.threadID, event.messageID);

 const [ask, ans] = parts.map(p => p.trim());
 
 const groupID = event.threadID; 
 let groupName = event.threadName ? event.threadName.trim() : ""; 
 
 if (!groupName && groupID != uid) {
 try {
 const threadInfo = await api.getThreadInfo(groupID);
 if (threadInfo && threadInfo.threadName) {
 groupName = threadInfo.threadName.trim();
 }
 } catch (error) {
 console.error(`Error fetching thread info for ID ${groupID}:`, error);
 }
 }

 let teachUrl = `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}&groupID=${encodeURIComponent(groupID)}`;
 
 if (groupName) {
 teachUrl += `&groupName=${encodeURIComponent(groupName)}`;
 }

 const res = await axios.get(teachUrl);
 return api.sendMessage(`${res.data.message || "Reply added successfully!"}`, event.threadID, event.messageID);
 }

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 });
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(`| Error in baby command: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleReply = async function ({ api, event, Users, handleReply }) {
 try {
 const senderName = await Users.getNameUser(event.senderID);
 const replyText = event.body ? event.body.toLowerCase() : "";
 if (!replyText) return;

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 }
 );
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(` | Error in handleReply: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
 try {
 const raw = event.body ? event.body.toLowerCase().trim() : "";
 if (!raw) return;
 const senderName = await Users.getNameUser(event.senderID);
 const senderID = event.senderID;

 if (
 raw === "baby" || raw === "bot" || raw === "bby" ||
 raw === "jan" || raw === "xan" || raw === "জান" || raw === "বট" || raw === "বেবি" 
 ) {
 const greetings = [
 "Bolo baby 💬", "হুম? বলো 😺", "হ্যাঁ জানু 😚", "শুনছি বেবি 😘", "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈", "Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣" 
 ];
 const randomReply = greetings[Math.floor(Math.random() * greetings.length)];

 const mention = {
 body: `${randomReply} @${senderName}`,
 mentions: [{
 tag: `@${senderName}`,
 id: senderID
 }]
 };

 return api.sendMessage(mention, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 }, event.messageID);
 }

 if (
 raw.startsWith("baby ") || raw.startsWith("bot ") || raw.startsWith("bby ") ||
 raw.startsWith("jan ") || raw.startsWith("xan ") ||
 raw.startsWith("জান ") || raw.startsWith("বট ") || raw.startsWith("বেবি ")
 ) {
 const query = raw
 .replace(/^baby\s+|^bot\s+|^bby\s+|^jan\s+|^xan\s+|^জান\s+|^বট\s+|^বেবি\s+/i, "")
 .trim();
 if (!query) return;

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 });
 }
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(`| Error in handleEvent: ${err.message}`, event.threadID, event.messageID);
 }
};